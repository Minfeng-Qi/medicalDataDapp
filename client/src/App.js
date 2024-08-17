import React from 'react';
import UserForm from './components/UserForm';
import MedicalDataForm from './components/MedicalDataForm';
import AccessControlForm from './components/AccessControlForm';

const App = () => {
  return (
    <div>
      <UserForm />
      <MedicalDataForm />
      <AccessControlForm />
    </div>
  );
};

export default App;
