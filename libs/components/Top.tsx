import React, { useCallback, useEffect, useRef } from 'react';
import { useState } from 'react';
import { useRouter, withRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { getJwtToken, logOut, updateUserInfo } from '../auth';
import { Stack, Box, IconButton, Typography, Drawer, useMediaQuery } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { alpha, styled } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { CaretDown } from 'phosphor-react';
import useDeviceDetect from '../hooks/useDeviceDetect';
import Link from 'next/link';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { Logout } from '@mui/icons-material';
import { REACT_APP_API_URL } from '../config';
import NotificationBell from './common/NotificationBell';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Swal from 'sweetalert2';

const Top = () => {
  const isMobile = useMediaQuery('(max-width: 1300px)');
  const device = useDeviceDetect();
  const user = useReactiveVar(userVar);
  const { t, i18n } = useTranslation('common');
  const router = useRouter();

  // Existing states
  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
  const [lang, setLang] = useState<string | null>('en');
  const drop = Boolean(anchorEl2);
  const [colorChange, setColorChange] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<any | HTMLElement>(null);
  let open = Boolean(anchorEl);
  const [bgColor, setBgColor] = useState<boolean>(false);
  const [logoutAnchor, setLogoutAnchor] = React.useState<null | HTMLElement>(null);
  const logoutOpen = Boolean(logoutAnchor);

  // New states for responsive behavior
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileLangMenuOpen, setMobileLangMenuOpen] = useState(false);

  /** LIFECYCLES **/
  useEffect(() => {
    if (localStorage.getItem('locale') === null) {
      localStorage.setItem('locale', 'en');
      setLang('en');
    } else {
      setLang(localStorage.getItem('locale'));
    }
  }, [router]);

  useEffect(() => {
    switch (router.pathname) {
      case '/jewellery/detail':
        setBgColor(true);
        break;
      default:
        break;
    }
  }, [router]);

  useEffect(() => {
    const jwt = getJwtToken();
    if (jwt) updateUserInfo(jwt);
  }, []);

  // Close mobile menu when screen size changes
  useEffect(() => {
    if (!isMobile) {
      setMobileMenuOpen(false);
    }
  }, [isMobile]);

  /** HANDLERS **/
  const langClick = (e: any) => {
    setAnchorEl2(e.currentTarget);
  };

  const langClose = () => {
    setAnchorEl2(null);
  };

  const langChoice = useCallback(
    async (e: any) => {
      setLang(e.target.id);
      localStorage.setItem('locale', e.target.id);
      setAnchorEl2(null);
      setMobileLangMenuOpen(false);
      await router.push(router.asPath, router.asPath, { locale: e.target.id });
    },
    [router],
  );

  const changeNavbarColor = () => {
    if (window.scrollY >= 50) {
      setColorChange(true);
    } else {
      setColorChange(false);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleHover = (event: any) => {
    if (anchorEl !== event.currentTarget) {
      setAnchorEl(event.currentTarget);
    } else {
      setAnchorEl(null);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const StyledMenu = styled((props: MenuProps) => (
    <Menu
      elevation={0}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      {...props}
    />
  ))(({ theme }) => ({
    '& .MuiPaper-root': {
      top: '109px',
      borderRadius: 6,
      marginTop: theme.spacing(1),
      minWidth: 160,
      color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
      boxShadow:
        'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
      '& .MuiMenu-list': {
        padding: '4px 0',
      },
      '& .MuiMenuItem-root': {
        '& .MuiSvgIcon-root': {
          fontSize: 18,
          color: theme.palette.text.secondary,
          marginRight: theme.spacing(1.5),
        },
        '&:active': {
          backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
        },
      },
    },
  }));

  // Navigation items for reusability
  const navigationItems = [
    { href: '/', label: t('Home') },
    { href: '/jewellery', label: t('Jewelleries') },
    { href: '/agent', label: t('Agents') },
    { href: '/community?articleCategory=FREE', label: t('Community') },
    ...(user?._id ? [{ href: '/mypage', label: t('My Page') }] : []),
    { href: '/cs', label: t('CS') },
  ];

  // Language options
  const languageOptions = [
    { code: 'en', flag: '/img/flag/langen.png', label: t('English') },
    { code: 'kr', flag: '/img/flag/langkr.png', label: t('Korean') },
    { code: 'ru', flag: '/img/flag/langru.png', label: t('Russian') },
  ];

  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', changeNavbarColor);
  }

  // Mobile Navigation Drawer
  const MobileDrawer = () => (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={closeMobileMenu}
      sx={{
        '& .MuiDrawer-paper': {
          width: '280px',
          padding: '20px',
          backgroundColor: '#fff',
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Menu
        </Typography>
        <IconButton onClick={closeMobileMenu}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* User Profile Section in Mobile */}
      {user?._id && (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
          <img
            src={user?.memberImage ? `${REACT_APP_API_URL}/${user?.memberImage}` : '/img/profile/defaultUser.svg'}
            alt="Profile"
            style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 12 }}
          />
          <Typography variant="body1">Welcome back!</Typography>
        </Box>
      )}

      {/* Navigation Links */}
      <Stack spacing={1} sx={{ mb: 3 }}>
        {navigationItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Typography
              sx={{
                p: 2,
                borderRadius: 1,
                cursor: 'pointer',
                '&:hover': { backgroundColor: '#f0f0f0' },
                fontWeight: 500,
              }}
              onClick={closeMobileMenu}
            >
              {item.label}
            </Typography>
          </Link>
        ))}
      </Stack>

      {/* Shopping Cart */}
      {user?._id && (
        <Box sx={{ mb: 3 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<AddShoppingCartIcon />}
            onClick={() => {
              closeMobileMenu();
              Swal.fire({
                title: 'Coming Soon',
                text: 'Stay tuned for something beautiful.',
                imageWidth: 80,
                imageHeight: 80,
                showConfirmButton: true,
                confirmButtonText: 'OK',
                confirmButtonColor: '#c2a27e',
              });
            }}
            sx={{ justifyContent: 'flex-start', p: 2 }}
          >
            Shopping Cart (0)
          </Button>
        </Box>
      )}

      {/* Language Selection */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
          Language
        </Typography>
        <Stack spacing={1}>
          {languageOptions.map((option) => (
            <Box
              key={option.code}
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 1.5,
                borderRadius: 1,
                cursor: 'pointer',
                backgroundColor: lang === option.code ? '#e3f2fd' : 'transparent',
                '&:hover': { backgroundColor: '#f0f0f0' },
              }}
              onClick={(e: any) => {
                e.target.id = option.code;
                langChoice(e);
              }}
            >
              <img src={option.flag} alt={option.label} style={{ width: 24, height: 16, marginRight: 12 }} />
              <Typography variant="body2">{option.label}</Typography>
            </Box>
          ))}
        </Stack>
      </Box>

      {/* Login/Logout */}
      {user?._id ? (
        <Button
          fullWidth
          variant="outlined"
          color="error"
          startIcon={<Logout />}
          onClick={() => {
            logOut();
            closeMobileMenu();
          }}
          sx={{ justifyContent: 'flex-start' }}
        >
          Logout
        </Button>
      ) : (
        <Link href="/account/join">
          <Button
            fullWidth
            variant="contained"
            startIcon={<AccountCircleOutlinedIcon />}
            onClick={closeMobileMenu}
            sx={{ justifyContent: 'flex-start' }}
          >
            {t('Login')} / {t('Register')}
          </Button>
        </Link>
      )}
    </Drawer>
  );

  // Mobile Header
  if (isMobile) {
    return (
      <>
        <Stack
          className="navbar mobile-navbar"
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 1100,
            backgroundColor: colorChange ? 'rgba(255,255,255,0.95)' : '#fff',
            backdropFilter: colorChange ? 'blur(10px)' : 'none',
            boxShadow: colorChange ? '0 2px 20px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.3s ease',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 16px',
              minHeight: '64px',
            }}
          >
            {/* Logo */}
            <Link href="/">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <img src="/img/logo/shoppe.svg" alt="Logo" style={{ height: '32px' }} />
              </Box>
            </Link>

            {/* Right side icons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {user?._id && <NotificationBell />}
              {user?._id && (
                <IconButton
                  onClick={() =>
                    Swal.fire({
                      title: 'Coming Soon',
                      text: 'Stay tuned for something beautiful.',
                      imageWidth: 80,
                      imageHeight: 80,
                      showConfirmButton: true,
                      confirmButtonText: 'OK',
                      confirmButtonColor: '#c2a27e',
                    })
                  }
                  sx={{ position: 'relative' }}
                >
                  <AddShoppingCartIcon />
                  <Typography
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      borderRadius: '50%',
                      width: 20,
                      height: 20,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      minWidth: 20,
                    }}
                  >
                    0
                  </Typography>
                </IconButton>
              )}
              <IconButton onClick={toggleMobileMenu} sx={{ ml: 1 }}>
                <MenuIcon />
              </IconButton>
            </Box>
          </Box>
        </Stack>
        <MobileDrawer />
      </>
    );
  }

  // Desktop/Tablet Header
  return (
    <Stack className={'navbar'}>
      <Stack
        className={`navbar-main ${colorChange ? 'transparent' : ''} ${bgColor ? 'transparent' : ''}`}
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          backgroundColor: colorChange ? 'rgba(255,255,255,0.95)' : '#fff',
          backdropFilter: colorChange ? 'blur(10px)' : 'none',
          boxShadow: colorChange ? '0 2px 20px rgba(0,0,0,0.1)' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <Stack className={'container'} sx={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <Box component={'div'} className={'logo-box'}>
            <Link href={'/'}>
              <img src="/img/logo/shoppe.svg" alt="Logo" />
            </Link>
          </Box>

          <Box
            component={'div'}
            className={'router-box'}
            sx={{
              display: 'flex',
              gap: '30px',
              '& > a > div': {
                fontSize: '16px',
              },
            }}
          >
            {navigationItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div>{item.label}</div>
              </Link>
            ))}
          </Box>

          <Box component={'div'} className={'user-box'} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {user?._id && (
              <IconButton
                sx={{
                  position: 'relative',
                }}
                color="default"
                onClick={() =>
                  Swal.fire({
                    title: 'Coming Soon',
                    text: 'Stay tuned for something beautiful.',
                    imageWidth: 80,
                    imageHeight: 80,
                    showConfirmButton: true,
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#c2a27e',
                  })
                }
              >
                <AddShoppingCartIcon />
                <Typography
                  className="view-cnt"
                  sx={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    borderRadius: '50%',
                    width: 20,
                    height: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    minWidth: 20,
                  }}
                >
                  0
                </Typography>
              </IconButton>
            )}

            {user?._id ? (
              <>
                <div className={'login-user'} onClick={(event: any) => setLogoutAnchor(event.currentTarget)}>
                  <img
                    src={
                      user?.memberImage ? `${REACT_APP_API_URL}/${user?.memberImage}` : '/img/profile/defaultUser.svg'
                    }
                    alt="Profile"
                  />
                </div>

                <Menu
                  id="basic-menu"
                  anchorEl={logoutAnchor}
                  open={logoutOpen}
                  onClose={() => setLogoutAnchor(null)}
                  sx={{ mt: '5px' }}
                >
                  <MenuItem onClick={() => logOut()}>
                    <Logout fontSize="small" style={{ color: 'blue', marginRight: '10px' }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Link href={'/account/join'}>
                <div className={'join-box'}>
                  <AccountCircleOutlinedIcon />
                  <span>
                    {t('Login')} / {t('Register')}
                  </span>
                </div>
              </Link>
            )}

            <div className={'lan-box'} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {user?._id && <NotificationBell />}
              <Button
                disableRipple
                className="btn-lang"
                onClick={langClick}
                endIcon={<CaretDown size={14} color="#616161" weight="fill" />}
                sx={{ minWidth: 'auto' }}
              >
                <Box component={'div'} className={'flag'}>
                  {lang !== null ? (
                    <img src={`/img/flag/lang${lang}.png`} alt={'Flag'} />
                  ) : (
                    <img src={`/img/flag/langen.png`} alt={'Flag'} />
                  )}
                </Box>
              </Button>

              <StyledMenu anchorEl={anchorEl2} open={drop} onClose={langClose} sx={{ position: 'absolute' }}>
                {languageOptions.map((option) => (
                  <MenuItem key={option.code} disableRipple onClick={langChoice} id={option.code}>
                    <img
                      className="img-flag"
                      src={option.flag}
                      onClick={langChoice}
                      id={option.code}
                      alt={`${option.label} Flag`}
                    />
                    {option.label}
                  </MenuItem>
                ))}
              </StyledMenu>
            </div>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default withRouter(Top);
