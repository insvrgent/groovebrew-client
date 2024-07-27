// src/components/AccountUpdateModal.js

import React, { useState } from 'react';
import styles from './AccountUpdateModal.module.css';
import { updateUser } from '../helpers/userHelpers';

const AccountUpdateModal = ({ user, showEmail, isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        username: user.username.startsWith('guest') ? '' : user.username || '',
        email: user.email || '',
        password: user.password === 'unsetunsetunset' ? '' : user.password || '',
        // Add other fields as needed
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await updateUser(formData);
            console.log('User updated successfully:', response);
            onSubmit(formData);
        } catch (error) {
            console.error('Failed to update user:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>Complete Your Account</h2>
                <form onSubmit={handleSubmit}>
                    <label className={styles.formLabel}>
                        Username:
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className={styles.formInput}
                        />
                    </label>
                    {showEmail &&
                        <label className={styles.formLabel}>
                            Email:
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={styles.formInput}
                            />
                        </label>
                    }
                    <label className={styles.formLabel}>
                        Password:
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={styles.formInput}
                        />
                    </label>
                    {/* Add other fields as needed */}
                    <button type="submit" className={styles.submitButton}>Submit</button>
                </form>
                <button onClick={onClose} className={styles.closeButton}>Close</button>
            </div>
        </div>
    );
};

export default AccountUpdateModal;
