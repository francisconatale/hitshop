import { ProductAdminRequest } from "@/types/product";

export interface ProductValidationErrors {
    name?: string;
    description?: string;
    price?: string;
    purchasePrice?: string;
    margin?: string;
    image?: string;
    category?: string;
}

/**
 * Valida los datos de un producto antes de enviarlos a la base de datos.
 * @param data Datos del producto desde el formulario admin.
 * @returns Un objeto con los mensajes de error encontrados.
 */
export const validateProduct = (data: ProductAdminRequest): ProductValidationErrors => {
    const errors: ProductValidationErrors = {};

    // Validación de Nombre
    if (!data.name || data.name.trim().length < 3) {
        errors.name = "el nombre debe tener al menos 3 caracteres";
    }

    // Validación de Precios
    if (data.price <= 0) {
        errors.price = "el precio de venta debe ser mayor a 0";
    }
    if (data.purchasePrice <= 0) {
        errors.purchasePrice = "el costo de compra debe ser mayor a 0";
    }

    // Validación de Imágenes
    if (!data.image || data.image.length === 0) {
        errors.image = "debes incluir al menos una imagen";
    } else if (data.image.some(img => !img.startsWith('http'))) {
        errors.image = "una o más URLs de imagen no son válidas";
    }

    // Validación de Categoría
    if (!data.category || data.category.trim() === "") {
        errors.category = "la categoría es obligatoria";
    }

    return errors;
};

/**
 * Verifica de forma rápida si un objeto de errores está vacío.
 */
export const isProductValid = (errors: ProductValidationErrors): boolean => {
    return Object.keys(errors).length === 0;
};
