export const resolveCardUrl = (cardUrl: string, hiddenUse = false) => {
  return hiddenUse ? "https://i.imgur.com/ZCgCjk8.jpg" : cardUrl;
};
