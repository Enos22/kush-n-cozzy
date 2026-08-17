const API_URL =
    import.meta.env.VITE_API_URL ||
    (typeof window !== "undefined" &&
        window.location.hostname === "localhost"
        ? "http://localhost:4000"
        : "");

async function request(path, options = {}) {
    // Local development with JSON Server
    if (API_URL) {
        const response = await fetch(`${API_URL}${path}`, {
            ...options,
            headers: {
                "content-type": "application/json",
                ...options.headers,
            },
        });

        if (!response.ok) {
            const message = await response.text();
            throw new Error(
                message || `Request failed with status ${response.status}`
            );
        }

        if (response.status === 204) return null;

        return response.json();
    }

    // GitHub Pages / static production
    const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
    const dbPath = `${base}/db.json`;

    const response = await fetch(dbPath);

    if (!response.ok) {
        const message = await response.text();
        throw new Error(
            message || `Could not load db.json (${response.status})`
        );
    }

    const data = await response.json();

    // GET /products
    if (path === "/products") {
        return data.products || [];
    }

    // GET /products/:id
    if (path.startsWith("/products/")) {
        const id = path.split("/").pop();

        const product = (data.products || []).find(
            (p) => String(p.id) === String(id)
        );

        if (!product) {
            throw new Error("Product not found");
        }

        return product;
    }

    throw new Error("Unsupported API path for static site");
}

export function getProducts() {
    return request("/products");
}

export function getProduct(id) {
    return request(`/products/${id}`);
}

export function createProduct(product) {
    return request("/products", {
        method: "POST",
        body: JSON.stringify(product),
    });
}

export function updateProduct(id, changes) {
    return request(`/products/${id}`, {
        method: "PATCH",
        body: JSON.stringify(changes),
    });
}

export function deleteProduct(id) {
    return request(`/products/${id}`, {
        method: "DELETE",
    });
}