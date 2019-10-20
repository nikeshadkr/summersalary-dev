const validationRules = {
    required: val => val !== null && val !== undefined && val !== ""
};

const onChange = (event, schemaObject, handleChangeCallBack) => {
    schemaObject.value = event.target.value;
    handleChangeCallBack(event);
};

const onBlur = schemaObject => {
    schemaObject.isTouched = true;
};

export const validationSchema = {
    college: {
        value: "",
        isTouched: false,
        isValid: false,
        onChange: onChange,
        onTouched: onBlur,
        errors: [],
        validationRules: [
            {
                rule: validationRules.required,
                message: "This field is required"
            }
        ]
    },
    summerYear: {
        value: "",
        isTouched: false,
        isValid: false,
        errors: [],
        onChange: onChange,
        onTouched: onBlur,
        validationRules: [
            {
                rule: validationRules.required,
                message: "This field is required"
            }
        ]
    },
    paymentNumber: {
        value: "",
        isTouched: false,
        isValid: false,
        errors: [],
        onChange: onChange,
        onTouched: onBlur,
        validationRules: [
            {
                rule: validationRules.required,
                message: "This field is required"
            }
        ]
    }
};

export const validateForm = setStateToReRenderComponent => {
    let isValid = true;

    Object.keys(validationSchema).map(obj => {
        validateField(validationSchema[obj]);

        if (validationSchema[obj].isValid === false) isValid = false;
    });

    setStateToReRenderComponent(state => ({ ...state }));

    return isValid;
};

export const validateField = vObject => {
    vObject.errors = [];
    vObject.isValid = true;

    vObject.validationRules.map(vRule => {
        if (!vRule.rule(vObject.value)) {
            vObject.errors.push(vRule.message);
            vObject.isValid = false;
        }
    });
};
