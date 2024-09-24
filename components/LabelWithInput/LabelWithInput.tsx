import React from 'react'
import styles from './styles.module.css'

const LabelWithInput = ({
  title = "",
  inputPlaceholder = "Enter Here",
  inputValue = "",
  inputName = "",
  inputType = "text",
  handleInputChange = (name, val) => { },
  boxShadow,
  className = "",
  accept = "",
  disabled = false,
}: {
  title?: string;
  inputPlaceholder?: string;
  inputValue?: string;
  inputName?: string;
  inputType?: string;
  handleInputChange?: (name: string, val: string | FileList | null) => void;
  boxShadow?: string;
  className?: string;
  accept?: string;
  disabled?: boolean;
}) => {

  return (
    <label className={`${styles.app__Label} ${className}`}>
      {
        title?.length > 0 &&
        <span>{title}</span>
      }
      <input
        value={inputValue}
        type={inputType}
        name={inputName}
        placeholder={inputPlaceholder}
        onChange={({ target }) => {
          if (inputType && inputType === 'file') return handleInputChange(target.name, target.files);

          handleInputChange(target.name, target.value)
        }}
        style={{
          boxShadow,
        }}
        accept={accept}
        disabled={disabled}
      />
    </label>
  )
}

export default LabelWithInput;