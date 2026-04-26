import { doc, setDoc, updateDoc, getDocs, deleteDoc, getDoc, collection, Firestore, query, where, increment } from "firebase/firestore";
import { Product, PublicProduct, PrivateProduct, ProductAdminRequest, UpdateProductRequest } from "@/types/product";
import { validateProduct, isProductValid } from "@/lib/validation/product";

export class ProductsCollection {

    /**
     * Incrementa el contador de "codicia" cuando un producto es reservado/agregado al carrito.
     */
    async incrementGreedCounter(db: Firestore, id: string): Promise<void> {
        const productRef = doc(db, "products", id);
        await updateDoc(productRef, {
            greedCounter: increment(1)
        });
    }

    /**
     * Obtiene los productos por categoría.
     */
    async getProductsByCategory(db: Firestore, category: string, isAdmin: boolean): Promise<PublicProduct[] | Product[]> {
        const q = query(collection(db, "products"), where("category", "==", category));
        const snap = await getDocs(q);
        const publicProducts = snap.docs.map(d => ({ ...d.data(), id: d.id } as PublicProduct));

        if (!isAdmin) {
            return publicProducts;
        }

        const enriched = await Promise.all(publicProducts.map(async (product) => {
            const privateSnap = await getDoc(doc(db, "privateProducts", product.id));
            const privateData = privateSnap.exists() ? privateSnap.data() as PrivateProduct : {} as PrivateProduct;
            return { ...product, ...privateData } as Product;
        }));

        return enriched;
    }

    /**
     * Obtiene los productos según el rol.
     * - Usuario: solo campos públicos de `products/{id}` (1 query, sin datos privados).
     * - Admin: combina `products/{id}` + `privateProducts/{id}` para el documento completo.
     */
    async getProducts(db: Firestore, isAdmin: boolean): Promise<PublicProduct[] | Product[]> {
        const snap = await getDocs(collection(db, "products"));
        const publicProducts = snap.docs.map(d => ({ ...d.data(), id: d.id } as PublicProduct));

        if (!isAdmin) {
            return publicProducts;
        }

        // Para admins: enriquecemos con datos privados en paralelo
        const enriched = await Promise.all(publicProducts.map(async (product) => {
            const privateSnap = await getDoc(doc(db, "privateProducts", product.id));
            const privateData = privateSnap.exists() ? privateSnap.data() as PrivateProduct : {} as PrivateProduct;
            return { ...product, ...privateData } as Product;
        }));

        return enriched;
    }

    /**
     * Crea un producto en 2 documentos: público y privado.
     */
    async createProduct(db: Firestore, request: ProductAdminRequest): Promise<string> {
        const errors = validateProduct(request);
        if (!isProductValid(errors)) {
            throw new Error(JSON.stringify({ message: "Validation failed", errors }));
        }

        const id = crypto.randomUUID();

        const publicData: PublicProduct = {
            id,
            name: request.name,
            description: request.description,
            price: request.price,
            image: request.image,
            category: request.category,
            selled: request.selled,
            rating: request.rating || 0,
            greedCounter: request.greedCounter || 0,
        };

        const privateData: PrivateProduct = {
            purchasePrice: request.purchasePrice,
            margin: request.margin,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await Promise.all([
            setDoc(doc(db, "products", id), publicData),
            setDoc(doc(db, "privateProducts", id), privateData),
        ]);

        return id;
    }

    /**
     * Actualiza los campos indicados en el documento correspondiente.
     */
    async updateProduct(db: Firestore, id: string, request: UpdateProductRequest): Promise<string> {
        const publicUpdates: any = {};
        if (request.name !== undefined) publicUpdates.name = request.name;
        if (request.description !== undefined) publicUpdates.description = request.description;
        if (request.price !== undefined) publicUpdates.price = request.price;
        if (request.image !== undefined) publicUpdates.image = request.image;
        if (request.category !== undefined) publicUpdates.category = request.category;
        if (request.selled !== undefined) publicUpdates.selled = request.selled;
        if (request.rating !== undefined) publicUpdates.rating = request.rating;
        if (request.greedCounter !== undefined) publicUpdates.greedCounter = request.greedCounter;

        const privateUpdates: any = { updatedAt: new Date() };
        if (request.purchasePrice !== undefined) privateUpdates.purchasePrice = request.purchasePrice;
        if (request.margin !== undefined) privateUpdates.margin = request.margin;

        const promises = [];
        if (Object.keys(publicUpdates).length > 0) {
            promises.push(updateDoc(doc(db, "products", id), publicUpdates));
        }
        if (Object.keys(privateUpdates).length > 1) {
            promises.push(updateDoc(doc(db, "privateProducts", id), privateUpdates));
        }

        await Promise.all(promises);
        return id;
    }

    /**
     * Obtiene un producto por su ID.
     */
    async getProductById(db: Firestore, id: string, isAdmin: boolean): Promise<Product | PublicProduct | null> {
        const publicSnap = await getDoc(doc(db, "products", id));
        if (!publicSnap.exists()) return null;

        const publicData = { ...publicSnap.data(), id: publicSnap.id } as PublicProduct;

        if (!isAdmin) {
            return publicData;
        }

        const privateSnap = await getDoc(doc(db, "privateProducts", id));
        const privateData = privateSnap.exists() ? privateSnap.data() as PrivateProduct : {} as PrivateProduct;

        return { ...publicData, ...privateData } as Product;
    }

    /**
     * Elimina ambos documentos del producto.
     */
    async deleteProduct(db: Firestore, id: string): Promise<string> {
        await Promise.all([
            deleteDoc(doc(db, "products", id)),
            deleteDoc(doc(db, "privateProducts", id)),
        ]);
        return id;
    }
}

export default new ProductsCollection();