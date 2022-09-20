import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import Link from 'next/link';
import Image from 'next/Image';

import BackgroundLetterAvatar from '../components/BackgroundLetterAvatar';

import { User } from '../types';

const pages = [
  {
    name: 'Wishlist',
    path: '/wishlist',
    protected: true
  }
];

const settings = [
  {
    name: 'Profile',
    path: '/settings'
  }
];

type Props = {
  username?: string;
  logout: unknown;
}


const NavBar = ({ username, logout }: Props) => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    handleCloseUserMenu()
    logout();
  }

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}>
            <Link href="/" passHref>
              <a>
                <Image alt="OPTN GT7" src="/optn_logo.png" height={40} width="100%" />
              </a>
            </Link>
          </Box>

          {username &&
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {pages.map((page) => {
                  return (
                    <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                      <Link href={page.path} passHref>
                        <Typography textAlign="center">
                          {page.name}
                        </Typography>
                      </Link>
                    </MenuItem>
                  )
                })}
              </Menu>
            </Box>
          }

          <Box sx={{ display: { xs: 'flex', md: 'none' }, mr: 2, flexGrow: 1 }}>
            <Link href="/" passHref>
              <a>
                <Image alt="OPTN GT7" src="/optn_logo.png" width="100%" height="40px" />
              </a>
            </Link>
          </Box>

          {username &&
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Link key={page.name} href={page.path} passHref>
                  <Button
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                  >
                    {page.name}
                  </Button>
                </Link>
              ))}
            </Box>
          }

          {username &&
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <BackgroundLetterAvatar name={username} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting.name} onClick={handleCloseUserMenu}>
                    <Link href={setting.path} passHref>
                      <Typography textAlign="center">{setting.name}</Typography>
                    </Link>
                  </MenuItem>
                ))}
                <MenuItem onClick={handleLogout}>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          }

        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default NavBar;
