import { useTranslation } from "react-i18next";

function LanguageToggle() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "fr" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="rounded-xl border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-800 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-900"
      aria-label="Toggle language"
    >
      {i18n.language === "en" ? "FR" : "EN"}
    </button>
  );
}

export default LanguageToggle
