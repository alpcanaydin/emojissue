(() => {
  const REGEX = /https:\/\/github\.com\/(.*)\/(.*)\/issues\/(.*)/;
  const previousContainer = document.getElementById('emojissue');

  if (!REGEX.test(document.location.href) && previousContainer) {
    previousContainer.remove();
  }

  if (previousContainer) {
    if (previousContainer.getAttribute('data-pathname') === document.location.pathname) {
      return;
    }

    previousContainer.remove();
  }

  // Positive Emojis
  const positiveEmojis = ['heart', '+1', 'tada'];

  // Generate content
  const generateHTML = args => `
    <span class="emoji">🤘</span> See #${args.currentIndex + 1}
    <span class="reacts">+${args.topFive[args.currentIndex].score} Reacts</span>
  `;

  // Collect top five reacted comments
  const collectMostReactedComments = allComments => {
    const mostReactedComments = [];

    allComments.forEach((comment, index) => {
      if (index === 0) {
        return;
      }

      const reactions = comment.querySelectorAll('.comment-reactions-options g-emoji');

      if (reactions.length) {
        const score = Array.from(reactions).reduce((prev, cur) => {
          const alias = cur.getAttribute('alias');

          if (positiveEmojis.indexOf(alias) !== -1) {
            return prev + parseInt(cur.nextSibling.textContent.trim(), 10);
          }

          return prev;
        }, 0);

        if (score > 0) {
          mostReactedComments.push({ id: comment.id, score });
        }
      }
    });

    return mostReactedComments.sort((a, b) => b.score - a.score).slice(0, 5);
  };

  const main = () => {
    const comments = document.querySelectorAll('.comment');
    const topFive = collectMostReactedComments(comments);

    if (!topFive.length) {
      return;
    }

    let currentIndex = 0;

    const button = document.createElement('button');
    button.innerHTML = generateHTML({ topFive, currentIndex });
    button.setAttribute('title', 'Click to see the most positive reacted issue comments.');
    button.classList.add('emojissue');
    button.addEventListener('click', () => {
      document.location.href = `#${topFive[currentIndex].id}`;

      if (currentIndex < topFive.length - 1) {
        currentIndex += 1;
        button.innerHTML = generateHTML({ topFive, currentIndex });
        return;
      }

      currentIndex = 0;
      button.innerHTML = '🤘 Go Back to #1';
    });

    const container = document.createElement('div');
    container.id = 'emojissue';
    container.classList.add('emojissueContainer');
    container.setAttribute('data-pathname', document.location.pathname);
    container.appendChild(button);

    document.body.appendChild(container);
  };

  const interval = setInterval(() => {
    if (document.getElementById('js-pjax-loader-bar').classList.contains('is-loading')) {
      return;
    }

    clearInterval(interval);
    main();
  }, 500);
})();
