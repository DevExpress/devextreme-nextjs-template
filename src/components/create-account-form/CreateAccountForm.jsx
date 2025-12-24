'use client'
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Form, {
  Item,
  Label,
  ButtonItem,
  ButtonOptions,
  RequiredRule,
  CustomRule,
  EmailRule,
} from 'devextreme-react/form';
import notify from 'devextreme/ui/notify';
import LoadIndicator from 'devextreme-react/load-indicator';
import { signUp } from '@/app/actions/auth';

import './CreateAccountForm.scss';

export default function CreateAccountForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const onFieldDataChanged = useCallback((e) => {
    const { dataField, value } = e;

    if (dataField) {
      setFormData(formData => ({
        ...formData,
        [dataField]: value,
      }));
    }
  }, []);

  const onSubmit = useCallback(async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    setLoading(true);

    const result = await signUp(email, password);
    setLoading(false);

    if (result.isOk) {
      router.push('/login');
    } else {
      notify(result.message, 'error', 2000);
    }
  }, [router, formData]);

  const confirmPassword = useCallback(
    ({ value }) => value === formData.password,
    [formData]
  );

  return (
    <form className={'create-account-form'} onSubmit={onSubmit}>
      <Form formData={formData} disabled={loading} onFieldDataChanged={onFieldDataChanged}>
        <Item
          dataField={'email'}
          editorType={'dxTextBox'}
          editorOptions={emailEditorOptions}
        >
          <RequiredRule message="Email is required" />
          <EmailRule message="Email is invalid" />
          <Label visible={false} />
        </Item>
        <Item
          dataField={'password'}
          editorType={'dxTextBox'}
          editorOptions={passwordEditorOptions}
        >
          <RequiredRule message="Password is required" />
          <Label visible={false} />
        </Item>
        <Item
          dataField={'confirmedPassword'}
          editorType={'dxTextBox'}
          editorOptions={confirmedPasswordEditorOptions}
        >
          <RequiredRule message="Password is required" />
          <CustomRule
            message={'Passwords do not match'}
            validationCallback={confirmPassword}
          />
          <Label visible={false} />
        </Item>
        <Item>
          <div className='policy-info'>
            By creating an account, you agree to the <Link href="#">Terms of Service</Link> and <Link href="#">Privacy Policy</Link>
          </div>
        </Item>
        <ButtonItem>
          <ButtonOptions
            width={'100%'}
            type={'default'}
            useSubmitBehavior={true}
          >
            <span className="dx-button-text">
              {
                loading
                  ? <LoadIndicator width={'24px'} height={'24px'} visible={true} />
                  : 'Create a new account'
              }
            </span>
          </ButtonOptions>
        </ButtonItem>
      </Form>
      <div className={'login-link'}>
        Have an account? <Link href={'/login'}>Sign In</Link>
      </div>
    </form>
  );
}

const emailEditorOptions = { stylingMode: 'filled', placeholder: 'Email', mode: 'email' };
const passwordEditorOptions = { stylingMode: 'filled', placeholder: 'Password', mode: 'password' };
const confirmedPasswordEditorOptions = { stylingMode: 'filled', placeholder: 'Confirm Password', mode: 'password' };
