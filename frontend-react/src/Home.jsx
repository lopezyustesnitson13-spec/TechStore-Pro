import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard.jsx";
import ProductoModal from "./ProductoModal.jsx";

function Home() {
  const navegar = useNavigate();
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const[seleccionado, setSeleccionado] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/productos")
      .then((res) => res.json())
      .then((datos) => setProductos(datos))
      .catch(() => setError("No se pudo conectar al servidor"))
      .finally(() => setCargando(false));
  }, []);

  const destacado = productos[0];
  const catalogo = productos.slice(0, 4);

  const estadisticas = [
    { valor: cargando || error ? "-" : productos.length, etiqueta: "productos" },
    { valor: "2023", etiqueta: "desde" },
    { valor: "Huila", etiqueta: "Garzón" },
  ];

  return (
    <div className="flex flex-col gap-24">
      {/* SECCIÓN HERO */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-8">
        <div className="lg:col-span-7 flex flex-col gap-6">
          <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold">
            Tecnología Premium
          </span>
          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-ink leading-tight">
            Catálogo curado para desarrolladores y creadores
          </h1>
          <p className="text-gray-500 text-lg max-w-xl leading-relaxed">
            Hardware seleccionado para garantizar el máximo rendimiento en tus proyectos. Envíos directos a Garzón y todo el Huila.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/productos"
              className="bg-ink text-paper px-8 py-3.5 rounded-card text-sm font-semibold hover:bg-accent transition-colors"
            >
              Ver productos
            </Link>
            <Link
              to="/contacto"
              className="border border-gray-300 text-ink px-8 py-3.5 rounded-card text-sm font-semibold hover:border-ink transition-colors"
            >
              Contactar
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-100">
            {estadisticas.map((item, idx) => (
              <div key={idx} className="flex flex-col">
                <span className="font-mono text-2xl font-bold text-ink">
                  {item.valor}
                </span>
                <span className="font-mono text-xs text-gray-500 uppercase tracking-wider mt-1">
                  {item.etiqueta}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* TARJETA FLOTANTE / DESTACADO */}
        <div className="lg:col-span-5">
          {destacado ? (
            <div className="relative group bg-paper border border-gray-100 rounded-3xl p-6 shadow-float transition-all hover:border-gray-300">
              <div className="aspect-4/3 w-full bg-gray-50 rounded-2xl overflow-hidden mb-6 flex items-center justify-center">
                <img
                  src={destacado.imagen}
                  alt={destacado.nombre}
                  className="h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <span className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
                Producto Destacado
              </span>
              <h2 className="font-display font-bold text-2xl text-ink mt-1 mb-2">
                {destacado.nombre}
              </h2>
              <p className="text-gray-500 text-sm line-clamp-2 mb-6">
                {destacado.descripcion}
              </p>
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl font-bold text-ink">
                  ${destacado.precio?.toLocaleString("es-CO")}
                </span>
                <button
                  onClick={() => navegar("/productos")}
                  className="bg-accent text-paper px-6 py-2.5 rounded-card text-sm font-semibold hover:bg-accent-dark transition-colors"
                >
                  Explorar
                </button>
              </div>
            </div>
          ) : (
            <div className="h-96 bg-gray-50 rounded-3xl border border-gray-100 flex items-center justify-center text-gray-500 font-mono text-sm">
              {cargando ? "Cargando destacado..." : "No hay productos"}
            </div>
          )}
        </div>
      </section>

      {/* CATÁLOGO DESTACADO */}
      <section className="flex flex-col gap-8">
        <div className="flex items-end justify-between border-b border-gray-100 pb-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-gray-500">
              Selección
            </span>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-ink mt-1">
              Catálogo principal
            </h2>
          </div>
          <Link
            to="/productos"
            className="font-mono text-xs text-accent hover:underline font-semibold uppercase tracking-wider"
          >
            Ver todos los productos →
          </Link>
        </div>

        {cargando && (
          <div className="text-center py-12 font-mono text-sm text-gray-500">
            Cargando catálogo...
          </div>
        )}

        {error && (
          <div className="text-center py-12 font-mono text-sm text-accent">
            {error}
          </div>
        )}

        {!cargando && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {catalogo.map((prod) => (
              <ProductCard
                key={prod.id}
                id={prod.id}
                nombre={prod.nombre}
                precio={prod.precio}
                descripcion={prod.descripcion}
                imagen={prod.imagen}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;