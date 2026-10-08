// Обратимая латиница для имён в ссылке.
// Ссылка без кириллицы открывается везде (Telegram Desktop ломал кириллические), а имя остаётся читаемым.
// Обычная буква — одна латинская (Олена → Olena). Особая — буква с меткой «x» (ж → zx, ю → ux, я → ax).
// В кириллице одиночного x нет, поэтому разбор обратно однозначный. Пробел — «_», апостроф — «~».
(function () {
  const SINGLE = {
    "а": "a", "б": "b", "в": "v", "г": "g", "д": "d", "е": "e", "з": "z", "и": "y", "і": "i", "й": "j",
    "к": "k", "л": "l", "м": "m", "н": "n", "о": "o", "п": "p", "р": "r", "с": "s", "т": "t", "у": "u",
    "ф": "f", "х": "h", "ц": "c", "ь": "w", "ъ": "q"
  };
  const MARKED = {
    "ж": "zx", "ч": "cx", "ш": "sx", "щ": "wx", "ю": "ux", "я": "ax", "є": "ex", "ї": "ix", "ґ": "gx",
    "ы": "yx", "ё": "ox", "э": "qx"
  };
  const SPACE = "_", APOSTROPHE = "~";
  const APOSTROPHES = ["'", "’", "ʼ", "`"];
  const PASS_THROUGH = /[0-9-]/;

  const reverse = table => Object.fromEntries(Object.entries(table).map(([letter, code]) => [code, letter]));
  const SINGLE_BACK = reverse(SINGLE), MARKED_BACK = reverse(MARKED);

  // Кириллица → латиница. null, если в имени есть то, что так не записать (латиница, редкие знаки).
  function encode(text) {
    let result = "";
    for (const symbol of text) {
      const lower = symbol.toLowerCase();
      const code = SINGLE[lower] || MARKED[lower];
      if (code) result += symbol !== lower ? code[0].toUpperCase() + code.slice(1) : code;
      else if (/\s/.test(symbol)) result += SPACE;
      else if (APOSTROPHES.includes(symbol)) result += APOSTROPHE;
      else if (PASS_THROUGH.test(symbol)) result += symbol;
      else return null;
    }
    return result;
  }

  function decode(text) {
    let result = "";
    for (let index = 0; index < text.length; index++) {
      const symbol = text[index];
      if (symbol === SPACE) { result += " "; continue; }
      if (symbol === APOSTROPHE) { result += "'"; continue; }
      const lower = symbol.toLowerCase();
      let letter = text[index + 1] === "x" ? MARKED_BACK[lower + "x"] : undefined;
      if (letter) index++;
      else letter = SINGLE_BACK[lower];
      if (!letter) { result += symbol; continue; }
      result += symbol !== lower ? letter.toUpperCase() : letter;
    }
    return result;
  }

  window.NameTranslit = { encode, decode };
})();
