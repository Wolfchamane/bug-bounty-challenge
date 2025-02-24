import { Grow, Box, Theme, Toolbar, Typography, Select, MenuItem, FormControl, type SelectChangeEvent } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { styled, useTheme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { User } from "../../api/services/User/store";
import AvatarMenu from "../AvatarMenu";
import { defaultTranslationModules } from '../../i18n';

interface AppBarProps extends MuiAppBarProps {
  theme?: Theme;
}

interface AppHeaderProps {
  user: User;
  pageTitle: string;
}

const typoStyle = {
  display: "flex",
  alignContent: "center",
  justifyContent: "center",
  lineHeight: 1
};

const AppBar = styled(MuiAppBar)<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: theme.palette.common.black,
  color: theme.palette.common.white,
  height: theme.tokens.header.height
}));

const AppHeader = React.forwardRef((props: AppHeaderProps, ref) => {
  const { user, pageTitle } = props;
  const { t, i18n } = useTranslation("app");
  const theme = useTheme();

  const [count, setCount] = useState(0);
  const [ countDownMinutes, setCountDownMinutes ] = useState('59');
  const [ countDownSeconds, setCountDownSeconds ] = useState('59');
  
  useEffect(() => {
    const hours = 1;
    const minutes = hours * 60;
    const seconds = minutes * 60;
    const countdown = seconds - count;
    setCountDownMinutes(`${~~(countdown / 60)}`.padStart(2, "0"));
    setCountDownSeconds((countdown % 60).toFixed(0).padStart(2, "0"));
  }, [ count ]);

  useEffect(() => {
    setInterval(() => {
      setCount((c) => c + 1);
    }, 1000);
  }, [ setCount ]);

  const handleLangChange = ({ target }: SelectChangeEvent<string>) => {
    const { value } = target;
    i18n.changeLanguage(value);
  };

  return (
    <AppBar ref={ref} position="fixed" sx={{ width: "100vw" }}>
      <Toolbar sx={{ background: "#08140C 0% 0% no-repeat padding-box" }}>
        <Box sx={{ width: "100%", flexDirection: "row", display: "flex" }}>
          <Box>
            <Typography variant="h6" component="div" color="primary">
              {countDownMinutes}:{countDownSeconds}
            </Typography>
          </Box>
          <Box sx={{ width: 20, height: 20, flex: 1 }} />
          <Box sx={{ flex: 2 }}>
            <Typography
              sx={{
                ...typoStyle,
                color: theme.palette.primary.main,
                mb: theme.spacing(0.5)
              }}
              variant="h6"
              component="div"
            >
              {t("appTitle").toLocaleUpperCase()}
            </Typography>
            <Typography
              sx={{ ...typoStyle }}
              variant="overline"
              component="div"
              noWrap
            >
              {pageTitle.toLocaleUpperCase()}
            </Typography>
          </Box>
          <Box sx={{ flex: 1, justifyContent: "flex-end", display: "flex", alignItems: "center" }}>
            {user && user.eMail && (
              // Don't now how to fix the issue with the "scrollTop"
              /*<Grow in={Boolean(user && user.eMail)}>
                <AvatarMenu user={user} >
              </Grow>*/
              <AvatarMenu user={user} />
            )}
            <FormControl size="small">
              <Select name="lang-selector" id="lang-selector" value={i18n.language} onChange={handleLangChange}>
                  { Object.values(defaultTranslationModules).map((lang) => (
                    <MenuItem value={lang.locale} key={`lang-${lang.locale}`}>
                      <Typography color="primary">{lang.locale}</Typography>
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
});

export default AppHeader;
