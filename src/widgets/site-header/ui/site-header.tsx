export function SiteHeader() {
  return (
    <header className="relative z-30 border-b border-border bg-surface">
      <div className="mx-auto flex min-h-18 w-full max-w-container items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
        <a
          href="#main-content"
          className="max-w-[48%] text-sm font-bold leading-5 tracking-normal text-brand sm:max-w-none sm:text-xl lg:text-2xl"
          aria-label={'Центр развития туризма АО "ФПК" — на главную'}
        >
          Центр развития туризма АО &quot;ФПК&quot;
        </a>
        <span className="max-w-[52%] text-right text-xs font-medium leading-5 text-text-secondary sm:max-w-none sm:text-base">
          Тестовое задание Нерознак Дмитрий
        </span>
      </div>
    </header>
  );
}
