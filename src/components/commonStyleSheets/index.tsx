const getTutorialImageStyle = (imagePath: string) => ({
  flexShrink: 1,
  flexGrow: 1,
  backgroundImage: `url(${imagePath})`,
  backgroundSize: 'contain',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
});

const settingInputStyles = {
  borderRadius: 0,
  backgroundColor: 'transparent',
  mb: 1,
  color: 'white',

  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#fff',
    borderRadius: 0,
  },

  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#fff',
  },

  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#fff',
  },

  '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
    borderColor: '#fff',
  },

  '& .MuiOutlinedInput-input': {
    padding: '8px 10px',
    height: 'auto',

    '&::placeholder': {
      color: 'white',
    },
  },
};

const labelStyles = {
  color: 'white',
  fontWeight: 600,
};

export { getTutorialImageStyle, labelStyles, settingInputStyles };
