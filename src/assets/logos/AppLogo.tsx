import React from 'react';

const AppLogo = () => {
  return (
    <div
      className="fixed top-0 left-0 w-full h-full z-[-1]"
      style={{
        backgroundImage: `url('/assets/logos/logo1.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: 1,
        backdropFilter: 'brightness(110%)',
      }}
    />
  );
};

export default AppLogo;
