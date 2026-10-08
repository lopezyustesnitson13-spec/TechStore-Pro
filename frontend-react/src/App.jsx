import Navbar from "./Navbar";
import Footer from "./Footer";
import ProductCard from "./ProductCard.jsx";

const productos = [
  {
    nombre: "Mouse Inalámbrico",
    descripcion: "Mouse ergonómico, conexión Bluetooth",
    precio: "$89.900",
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSx1SFuYuPzsO0mqGJyOP2bzNBccCYIcn5_jUiIyZJN0g&s=10",
    stock: 10,
  },
  {
    nombre: "Teclado Mecánico",
    descripcion: "Switches azules, retroiluminado RGB",
    precio: "$149.900",
    imagen: "https://exitocol.vtexassets.com/arquivos/ids/10150101/teclado-mecanico-razer-blackwidow-v3-rgb.jpg?v=637679415794200000",
    stock: 5,
  },
  {
    nombre: 'Monitor 24"',
    descripcion: "Full HD, 75Hz, panel IPS",
    precio: "$899.900",
    imagen: "https://carulla.vtexassets.com/arquivos/ids/12115441/monitor-gamer-acer-nitro-24-pulgadas-full-hd-75-hz-1-ms-vg240y.jpg?v=638183180733000000",
    stock: 8,
  },
   {
    nombre: "Audífonos Bluetooth",
    descripcion: "Cancelación de ruido, 20h de batería",
    precio: "$149.900",
    imagen: "https://exitocol.vtexassets.com/arquivos/ids/10150101/teclado-mecanico-razer-blackwidow-v3-rgb.jpg?v=637679415794200000",
    stock: 10,
  },
];

function App() {
  return (
    <main className="min-h-screen max-w-6xl mx-auto px-6 py-10 flex flex-col gap-10">
      <Navbar />

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productos.map((p) => (
          <ProductCard
            key={p.nombre}
            nombre={p.nombre}
            descripcion={p.descripcion}
            precio={p.precio}
            imagen={p.imagen}
            stock={p.stock}
          />
        ))}
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}

export default App;