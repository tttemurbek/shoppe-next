import { useCallback, useState } from 'react';
import type { NextPage, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Button, Checkbox, FormControlLabel, FormGroup, Stack } from '@mui/material';
import { logIn, signUp } from '../../libs/auth';
import { sweetMixinErrorAlert } from '../../libs/sweetAlert';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common'])),
  },
});

const Join: NextPage = () => {
  const router = useRouter();
  const device = useDeviceDetect();

  const [input, setInput] = useState({
    nick: '',
    password: '',
    phone: '',
    type: 'USER',
  });

  const [rightPanelActive, setRightPanelActive] = useState<boolean>(false);

  /** HANDLERS **/
  const viewChangeHandler = (state: boolean) => {
    setRightPanelActive(state);
  };

  const checkUserTypeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setInput((prev) => ({
      ...prev,
      type: checked ? name : 'USER',
    }));
  };

  const handleInput = useCallback((name: string, value: string) => {
    setInput((prev) => ({ ...prev, [name]: value }));
  }, []);

  const doLogin = useCallback(async () => {
    try {
      await logIn(input.nick, input.password);
      await router.push(`${router.query.referrer ?? '/'}`);
    } catch (err: any) {
      await sweetMixinErrorAlert(err.message);
    }
  }, [input, router]);

  const doSignUp = useCallback(async () => {
    try {
      await signUp(input.nick, input.password, input.phone, input.type);
      await router.push(`${router.query.referrer ?? '/'}`);
    } catch (err: any) {
      await sweetMixinErrorAlert(err.message);
    }
  }, [input, router]);

  const handleKeyDown = (action: () => void) => (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      action();
    }
  };

  if (device === 'mobile') {
    return <div>LOGIN MOBILE</div>;
  }

  return (
    <Stack className="join-page">
      <Stack className="container">
        <div className={`main ${rightPanelActive ? 'right-panel-active' : ''}`}>
          {/* Sign Up Container */}
          <div className="form-container sign-up-container">
            <div className="form-content">
              <div className="logo">
                <img src="/img/logo/favicon.png" alt="logo" />
                <span>shoppe</span>
              </div>
              <div className="info">
                <span>SIGNUP</span>
                <p>Sign up with this account across the following sites.</p>
              </div>
              <div className="input-wrap">
                <div className="input-box">
                  <span>Nickname</span>
                  <input
                    type="text"
                    placeholder="Enter Nickname"
                    onChange={(e) => handleInput('nick', e.target.value)}
                    onKeyDown={handleKeyDown(doSignUp)}
                    required
                  />
                </div>
                <div className="input-box">
                  <span>Password</span>
                  <input
                    type="password"
                    placeholder="Enter Password"
                    onChange={(e) => handleInput('password', e.target.value)}
                    onKeyDown={handleKeyDown(doSignUp)}
                    required
                  />
                </div>
                <div className="input-box">
                  <span>Phone</span>
                  <input
                    type="text"
                    placeholder="Enter Phone"
                    onChange={(e) => handleInput('phone', e.target.value)}
                    onKeyDown={handleKeyDown(doSignUp)}
                    required
                  />
                </div>
              </div>
              <div className="register">
                <div className="type-option">
                  <span className="text">I want to be registered as:</span>
                  <div className="checkbox-group">
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            name="USER"
                            onChange={checkUserTypeHandler}
                            checked={input.type === 'USER'}
                          />
                        }
                        label="User"
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            name="AGENT"
                            onChange={checkUserTypeHandler}
                            checked={input.type === 'AGENT'}
                          />
                        }
                        label="Agent"
                      />
                    </FormGroup>
                  </div>
                </div>
                <Button
                  variant="contained"
                  disabled={!input.nick || !input.password || !input.phone || !input.type}
                  onClick={doSignUp}
                  endIcon={<img src="/img/icons/rightup.svg" alt="icon" />}
                  className="action-button"
                >
                  SIGNUP
                </Button>
              </div>
            </div>
          </div>

          {/* Sign In Container */}
          <div className="form-container sign-in-container">
            <div className="form-content">
              <div className="logo">
                <img src="/img/logo/favicon.png" alt="logo" />
                <span>shoppe</span>
              </div>
              <div className="info">
                <span>LOGIN</span>
                <p>Login with this account across the following sites.</p>
              </div>
              <div className="input-wrap">
                <div className="input-box">
                  <span>Nickname</span>
                  <input
                    type="text"
                    placeholder="Enter Nickname"
                    onChange={(e) => handleInput('nick', e.target.value)}
                    onKeyDown={handleKeyDown(doLogin)}
                    required
                  />
                </div>
                <div className="input-box">
                  <span>Password</span>
                  <input
                    type="password"
                    placeholder="Enter Password"
                    onChange={(e) => handleInput('password', e.target.value)}
                    onKeyDown={handleKeyDown(doLogin)}
                    required
                  />
                </div>
              </div>
              <div className="register">
                <div className="remember-info">
                  <FormGroup>
                    <FormControlLabel control={<Checkbox defaultChecked size="small" />} label="Remember me" />
                  </FormGroup>
                  <a href="#">Lost your password?</a>
                </div>
                <Button
                  variant="contained"
                  disabled={!input.nick || !input.password}
                  onClick={doLogin}
                  endIcon={<img src="/img/icons/rightup.svg" alt="icon" />}
                  className="action-button"
                >
                  LOGIN
                </Button>
              </div>
            </div>
          </div>

          {/* Overlay Container */}
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <button className="ghost-button" onClick={() => viewChangeHandler(false)}>
                  LOGIN
                </button>
              </div>
              <div className="overlay-panel overlay-right">
                <button className="ghost-button" onClick={() => viewChangeHandler(true)}>
                  SIGNUP
                </button>
              </div>
            </div>
          </div>
        </div>
      </Stack>
    </Stack>
  );
};

export default withLayoutBasic(Join);
