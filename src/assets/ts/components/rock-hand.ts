export const initRockHand = () => {
  const hand = document.querySelector('[data-aone-hand]');

  if (hand) {
    const triggerHand = () => {
      hand.classList.add('is-visible');

      setTimeout(() => {
        hand.classList.remove('is-visible');
      }, 4500);
    };

    setTimeout(triggerHand, 2000);

    setInterval(triggerHand, 30000);
  }
};
