const getTutorialImageStyle = (imagePath: string) => ({
  flexShrink: 1,
  flexGrow: 1,
  backgroundImage: `url(${imagePath})`,
  backgroundSize: 'contain',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
});

const inputStyles = {
  '::placeholder': {
    color: 'white',
  },
  color: 'white',
};

const labelStyles = {
  color: 'white',
  fontWeight: 600,
};

export { getTutorialImageStyle, inputStyles, labelStyles };
