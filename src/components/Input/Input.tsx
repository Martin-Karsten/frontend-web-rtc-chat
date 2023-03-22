import React, { useState, useCallback } from 'react';

interface Props {
  onSubmit: (value: string) => void;
}

function Input({ onSubmit }: Props) {
  const [value, setValue] = useState('');

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  }, []);

  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(value);
    setValue('');
  }, [onSubmit, value]);

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={value} onChange={handleChange} />
      <button type="submit">Submit</button>
    </form>
  );
}

export default Input;
