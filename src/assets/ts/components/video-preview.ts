export const initVideoPreview = () => {
  const container = document.querySelector('[data-container-video]');

  if (!container) return;

  const preview = container?.querySelector(
    '[data-video-preview]',
  ) as HTMLDivElement;
  const vkIframe = container?.querySelector(
    '[data-vk-frame]',
  ) as HTMLIFrameElement;

  if (preview && vkIframe) {
    preview.addEventListener('click', () => {
      preview.style.opacity = '0';
      preview.style.pointerEvents = 'none';
      setTimeout(() => (preview.style.display = 'none'), 300);

      const currentSrc = vkIframe.src;
      vkIframe.src = currentSrc.replace('autoplay=0', 'autoplay=1');
    });
  }
};
