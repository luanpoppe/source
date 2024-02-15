import { render, screen, waitFor } from '@testing-library/angular';
import { SignUpComponent } from './sign-up.component';
import UserEvent from '@testing-library/user-event';
import 'whatwg-fetch';

describe('SignUpComponent', () => {
  describe('Layout', () => {
    it('has Sign Up header', async () => {
      await render(SignUpComponent);
      const header = screen.getByRole('heading', { name: 'Sign Up' });
      expect(header).toBeInTheDocument();
    });
    it('has username input', async () => {
      await render(SignUpComponent);
      expect(screen.getByLabelText('Username')).toBeInTheDocument();
    });
    it('has email input', async () => {
      await render(SignUpComponent);
      expect(screen.getByLabelText('E-mail')).toBeInTheDocument();
    });
    it('has password input', async () => {
      await render(SignUpComponent);
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    it('has password type for password input', async () => {
      await render(SignUpComponent);
      const input = screen.getByLabelText('Password');
      expect(input).toHaveAttribute('type', 'password');
    });
    it('has password repeat input', async () => {
      await render(SignUpComponent);
      expect(screen.getByLabelText('Password Repeat')).toBeInTheDocument();
    });

    it('has password type for password repeat input', async () => {
      await render(SignUpComponent);
      const input = screen.getByLabelText('Password Repeat');
      expect(input).toHaveAttribute('type', 'password');
    });
    it('has Sign Up button', async () => {
      await render(SignUpComponent);
      const button = screen.getByRole('button', { name: 'Sign Up' });
      expect(button).toBeInTheDocument();
    });
    it('disables the button initially', async () => {
      await render(SignUpComponent);
      const button = screen.getByRole('button', { name: 'Sign Up' });
      expect(button).toBeDisabled();
    });
  });

  describe('Interactions', () => {
    it('enables the button when the password and password repeat fields have the same value', async () => {
      await render(SignUpComponent);
      const password = screen.getByLabelText('Password');
      const passwordRepeat = screen.getByLabelText('Password Repeat');
      await UserEvent.type(password, 'P4ssword');
      await UserEvent.type(passwordRepeat, 'P4ssword');
      const button = screen.getByRole('button', { name: 'Sign Up' });
      await waitFor(() => {
        expect(button).toBeEnabled();
      });
    });

    it('sends username, email and password to backend after clicking the button', async () => {
      const spy = jest.spyOn(window, 'fetch');

      await render(SignUpComponent);
      const username = screen.getByLabelText('Username');
      const email = screen.getByLabelText('E-mail');
      const password = screen.getByLabelText('Password');
      const passwordRepeat = screen.getByLabelText('Password Repeat');
      await UserEvent.type(username, 'user1');
      await UserEvent.type(email, 'user1@mail.com');
      await UserEvent.type(password, 'P4ssword');
      await UserEvent.type(passwordRepeat, 'P4ssword');
      const button = screen.getByRole('button', {
        name: 'Sign Up',
      }) as HTMLButtonElement;
      await waitFor(() => {
        expect(button).toBeEnabled();
      });
      await UserEvent.click(button);

      const args: any = spy.mock.calls[0];
      const secondParam = args[1] as RequestInit;
      expect(secondParam.body).toEqual(
        JSON.stringify({
          username: 'user1',
          password: 'P4ssword',
          email: 'user1@mail.com',
        })
      );
    });
  });
});
