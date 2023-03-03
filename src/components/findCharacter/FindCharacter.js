import { Formik, Form, Field, ErrorMessage as FormikErrorMessage} from 'formik';
import * as Yup from "yup"
import { useState } from 'react';
import { Link } from 'react-router-dom';

import useMarverService from '../../services/MarverService';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './findCharacter.scss';

const FindCharacter = () => {
    const [char, setChar] = useState(null);

    const {loading, error, getCharacterByName, clearError} = useMarverService();

    const onCharLoaded = (char) => {
        setChar(char)
        console.log(char[0])
    }

    const updateChar = (name) => {
        clearError();

        getCharacterByName(name)
            .then(onCharLoaded)
    }

    const results = !char ? null : char.length > 0 ? (
        <div className='find__character_results'>
            <div className='find__character_result'>There is! Visit {char[0].name} page?</div>            

            <Link to={`/characters/${char[0].id}`} type='submit' className="button button__secondary">
                <div className='inner'>To page</div>
            </Link>
        </div>
    ) : (
        <div className='find__character_error'>The character was not found. Check the name and try again</div>
    )

    const errorMessage = error ? <div className='find__character_critical_error'><ErrorMessage/></div> : null;
    
    return (
        <Formik
            initialValues={{
                name: ''
            }}
            validationSchema={Yup.object({
                name: Yup.string()
                            .min(2, 'Minimum 2 characters')
                            .required('*Required field')
            })}
            onSubmit = {({name}) => {updateChar(name)}}>

            <Form className='find__character'>
                <h2 className='find__character_title'>Or find a character by name:</h2>
                <div className='find__character_form'>

                    <div className='find__character_in'>
                        <Field 
                            name="name"
                            id="name"
                            placeholder="Enter name"
                            type="text"
                            className="find__character_input" />

                        <button 
                            type='submit' 
                            className="button button__main"
                            disabled={loading}>
                            <div className='inner'>Find</div>
                        </button>
                    </div>

                    <FormikErrorMessage name="name" className="find__character_error" component="div"/>

                    {results}
                    {errorMessage}
                </div>
            </Form>
        </Formik>
    )
}

export default FindCharacter;