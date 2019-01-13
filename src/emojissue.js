const COMMENT_CLASS = '.timeline-comment-group';

// Positive Emojis
const positiveEmojis = ['heart', '+1', 'tada'];

// Generate content
const generateHTML = (args, initial = false) => {
  if (!initial && args.index === 0) {
    return '🤘 Go Back to #1';
  }

  const reactionPlaceholder = args.topFive[args.index].score > 1 ? 'reactions' : 'reaction';
  return `
      <span class="emoji">🤘</span> See #${args.index + 1}
      <span class="reacts">+${args.topFive[args.index].score} ${reactionPlaceholder}</span>
    `;
};

// Collect top five reacted comments
const collectMostReactedComments = allComments => {
  const mostReactedComments = [];

  allComments.forEach((comment, index) => {
    if (index === 0) {
      return;
    }

    const reactions = comment.querySelectorAll('.comment-reactions-options .emoji');

    if (reactions.length) {
      const score = Array.from(reactions).reduce((prev, cur) => {
        const alias = cur.getAttribute('alias');

        if (positiveEmojis.indexOf(alias) !== -1) {
          return prev + parseInt(cur.nextSibling.textContent.trim(), 10);
        }

        return prev;
      }, 0);

      mostReactedComments.push({ id: comment.id, score });
    }
  });

  return mostReactedComments.sort((a, b) => b.score - a.score).slice(0, 5);
};

const main = () => {
  const comments = document.querySelectorAll(COMMENT_CLASS);
  const topFive = collectMostReactedComments(comments);

  let container = document.getElementById('emojissue');
  let button = document.getElementById('emojissue-button');

  if (container && document.location.pathname !== container.getAttribute('data-pathname')) {
    container.remove();
    container = null;
    button = null;
  }

  if (!topFive.length) {
    return;
  }

  if (!button) {
    button = document.createElement('button');
    button.id = 'emojissue-button';
    button.setAttribute('title', 'Click to see the most positive reacted issue comments.');
    button.classList.add('emojissue');

    const currentIndex = container ? parseInt(container.getAttribute('data-current-index'), 10) : 0;

    button.innerHTML = generateHTML({ topFive, index: currentIndex }, true);
    button.addEventListener('click', () => {
      const index = parseInt(container.getAttribute('data-current-index'), 10);

      const newIndex = index < topFive.length - 1 ? index + 1 : 0;
      button.innerHTML = generateHTML({ topFive, index: newIndex });
      container.setAttribute('data-current-index', newIndex);
      document.location.href = `#${topFive[index].id}`;
    });
  }

  if (!container) {
    container = document.createElement('div');
    container.id = 'emojissue';
    container.classList.add('emojissueContainer');
    container.setAttribute('data-current-index', '0');
    container.setAttribute('data-pathname', document.location.pathname);
    container.appendChild(button);

    document.body.appendChild(container);
  }
};

if (!document.getElementById('js-pjax-loader-bar').classList.contains('is-loading')) {
  main();
}
