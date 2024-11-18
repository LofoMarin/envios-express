import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Ignora errores de ESLint durante la construcción
  },
  /* Otras opciones de configuración aquí */
};

export default nextConfig;
