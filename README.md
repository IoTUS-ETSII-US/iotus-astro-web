<p align="center">
  <img src="https://astro.build/assets/press/astro-logo-light-gradient.svg" alt="Logo de Astro" height="50" style="margin-right: 20px;" />
  <img src="https://meta-l.cdn.bubble.io/cdn-cgi/image/w=64,h=64,f=auto,dpr=1,fit=contain/f1685632623945x484360545462020800/supabase-logo-icon.png" alt="Logo de Supabase" height="50" />
</p>

# Documentación inicial

El proyecto está hecho con un framework web llamado [**Astro**](https://astro.build/). Es recomendable saber como funciona Astro minimamente antes de cambiar cualquier configuración. Para ello recomiendo leer las [**características principales**](https://docs.astro.build/es/concepts/why-astro/). La [**documentación**](https://docs.astro.build/es/getting-started/) de Astro es muy fácil de comprender.

## Clonar y correr proyecto en local

```bash
# Clonamos proyecto
git clone https://github.com/IoTUS-ETSII-US/iotus-astro-web

# Accedemos a la ruta del proyecto
cd iotus-astro-web

# Instalamos dependencias
pnpm install

# Corremos en local
pnpm run dev # --host
# Si ponemos la flag --host estaremos ejecutando el proyecto para toda nuestra red local, esto te permite poder ver el proyecto en cualquier otro dispositivo dentro de la misma red únicamente poniendo la IP de nuestro ordenador y el puerto

# IP_DEL_ORDENADOR_QUE_ALOJA:4321 (puerto 4321 por defecto)
```

Es importante saber que al ejecutar el proyecto no podrás obtener datos de la base de datos, ya que para ello deberas crear un **.env** y meter las variables que se piden (para obtener dichas variables hay que contactar con el/los administradores de la web).

## Dependencias instaladas

Dentro de las dependecias instaladas tenemos

* [**React**](https://react.dev/reference/react): Para componentes con gran reactividad (que requieran cambios de estados continuos)
* [**Lucide-react**](https://lucide.dev/guide/react/): Libreria para gestionar los .svg
* [**Tailwindcss**](https://tailwindcss.com/docs/installation/using-vite): Librería para facilitar el uso de estilos css
* [**Nanostores**](https://github.com/nanostores/nanostores): Librería para mantener el valor de las variables globales

## Páginas por hacer / terminar

``` txt
    > pages
    |
    |-- admin
    |-- api
    |-- blog (por hacer)
    |-- inventario (por terminar)
    |-- login (parcialmente terminado)
    |-- noticias (por hacer)
    |-- perfil (parcialmente terminado)
    |-- proyectos (temporalmente terminado)
    |-- register (parcialmente terminado)
    |--sobre-nosotros (por hacer)
```