const getTutorialImageStyle = (imagePath: string) => ({
    flexShrink: 1,
    flexGrow: 1,
    backgroundImage: `url(${imagePath})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  });

  export { getTutorialImageStyle };