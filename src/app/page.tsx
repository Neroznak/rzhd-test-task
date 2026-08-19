import { trains } from "@/entities/train/model";
import { CatalogHero } from "@/widgets/catalog-hero";
import { SiteHeader } from "@/widgets/site-header";
import { TrainCatalog } from "@/widgets/train-catalog";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface-muted">
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-50 -translate-y-24 rounded-lg bg-surface px-4 py-3 font-medium text-text-primary shadow-lg transition-transform focus:translate-y-0"
      >
        Перейти к содержимому
      </a>
      <SiteHeader />
      <main id="main-content">
        <CatalogHero />
        <TrainCatalog trains={trains} />
      </main>
      <footer className="border-t border-border bg-surface">
        <div className="mx-auto flex min-h-20 w-full max-w-container flex-col justify-center gap-3 px-5 py-5 text-sm text-text-secondary sm:px-8 lg:px-10">
          <div className="flex flex-col justify-center gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-text-primary">
                Центр развития туризма АО &quot;ФПК&quot;
              </p>
              <p>Прототип витрины туристских поездов</p>
            </div>
            <p>
              Фотографии:{" "}
              <a
                href="https://www.pexels.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-border underline-offset-4 transition-colors hover:text-brand"
              >
                Pexels
              </a>
            </p>
          </div>
          <p className="max-w-3xl text-xs leading-5">
            Шрифт использован только в рамках тестового задания и не является
            официальным применением фирменного стиля РЖД.
          </p>
        </div>
      </footer>
    </div>
  );
}
