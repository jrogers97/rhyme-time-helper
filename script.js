document.addEventListener("DOMContentLoaded", function () {
  // find all solutions for a set of prompts
  const findRhymingCombos = (prompts) => {
    const output = [];

    // map each prompt to an array of every word that fits that prompt
    const matchingWords = prompts.map((prompt) =>
      words.filter(
        (word) =>
          word.length === prompt.length &&
          prompt
            .split("")
            .every((letter, i) => letter === "*" || letter === word[i])
      )
    );

    // find the prompt that has the fewest matching words
    const fewestMatchesIndex = matchingWords.findIndex(
      (matches) =>
        matches.length === Math.min(...matchingWords.map((m) => m.length))
    );

    const fewestMatches = matchingWords[fewestMatchesIndex];

    const otherPrompts = [
      ...matchingWords.slice(0, fewestMatchesIndex),
      ...matchingWords.slice(fewestMatchesIndex + 1),
    ];

    // for each match, find words for other prompts that rhyme
    fewestMatches.forEach((word) => {
      const rhymes = window.pronouncing.rhymes(word);

      const otherPromptRhymes = otherPrompts.map((otherPrompt) =>
        otherPrompt.filter((promptMatch) => rhymes.includes(promptMatch))
      );

      // continue on if any prompt has no rhymes that fit
      if (otherPromptRhymes.some((r) => !r.length)) return;

      output.push([[word], ...otherPromptRhymes]);
    });

    return output;
  };

  const input1 = document.querySelector("#input-1");
  const input2 = document.querySelector("#input-2");
  const input3 = document.querySelector("#input-3");
  const submitBtn = document.querySelector("#submit-btn");
  const output = document.querySelector("#output");

  function makeWords(words) {
    return `<div class="words">${words
      .map((word) => `<p>${word}</p>`)
      .join("")}</div>`;
  }

  function makeResult(result) {
    return `<div class="result">${result.map(makeWords).join("")}</div>`;
  }

  submitBtn.addEventListener("click", () => {
    if (!input1.value || !input2.value || !input3.value) return;

    output.innerHTML = "";

    const results = findRhymingCombos([
      input1.value.toLowerCase(),
      input2.value.toLowerCase(),
      input3.value.toLowerCase(),
    ]);

    if (!results.length) {
      output.innerHTML = "<div class='result'>No results!</div>";
      return;
    }

    console.log(results);
    results.forEach((result) => {
      output.innerHTML += makeResult(result);
    });
  });
});
