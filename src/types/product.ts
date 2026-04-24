/**
 * Datos públicos visibles para cualquier usuario.
 */
export interface PublicProduct {
    id: string;
    name: string;
    description?: string;
    price: number;
    image: string[];
    category: string;
    selled: boolean;
}

/**
 * Datos privados, solo accesibles para admins.
 */
export interface PrivateProduct {
    purchasePrice: number;
    margin: number;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Documento completo que maneja el admin (combina público + privado).
 */
export interface Product extends PublicProduct, PrivateProduct {}

/**
 * DTO para crear un producto desde el panel de administración.
 */
export interface ProductAdminRequest {
    name: string;
    description?: string;
    price: number;
    purchasePrice: number;
    margin: number;
    image: string[];
    category: string;
    selled: boolean;
}

/**
 * DTO para actualizar parcialmente un producto.
 */
export interface UpdateProductRequest extends Partial<ProductAdminRequest> {
    id: string;
}
