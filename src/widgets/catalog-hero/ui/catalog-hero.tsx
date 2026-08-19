export function CatalogHero() {
  return (
    <section className="relative isolate overflow-hidden bg-hero text-white">
      <div
        className="absolute inset-0 -z-20 bg-cover bg-[68%_center] bg-no-repeat sm:bg-center"
        style={{ backgroundImage: "url(/images/hero.jpg)" }}
        role="img"
        aria-label="Туристский поезд среди лесов России"
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-r from-[#101b26]/72 via-[#142431]/32 to-transparent"
        aria-hidden="true"
      >
        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-black/18 to-transparent" />
      </div>

      <div className="relative mx-auto flex min-h-[430px] w-full max-w-container items-center px-5 pb-24 pt-20 sm:min-h-[500px] sm:px-8 sm:pb-28 lg:px-10">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.08em] text-white/70">
            Путешествуйте по России
          </p>
          <h1 className="text-balance text-4xl font-medium leading-[1.08] tracking-[-0.02em] sm:text-5xl lg:text-6xl">
            Россия начинается с дороги
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-white/80 sm:text-lg">
            Туристские поезда объединяют живописные маршруты, экскурсии и
            комфортное путешествие — остаётся выбрать направление.
          </p>
          <a
            href="#catalog"
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl bg-brand px-6 font-medium text-white transition-colors hover:bg-brand-hover"
          >
            Выбрать поезд
          </a>
        </div>
      </div>
    </section>
  );
}
