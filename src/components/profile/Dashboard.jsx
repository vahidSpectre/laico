import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Smartphone, Edit3, X, Check } from 'lucide-react';
import styles from './Dashboard.module.css';

const Dashboard = () => {
 const [isEditing, setIsEditing] = useState(false);
 const [userData, setUserData] = useState({
  firstName: 'کازمو',
  lastName: 'استارلایت',
  email: 'cosmo.starlight@galaxy.net',
  phone: '+1-234-567-8900',
 });
 const [tempUserData, setTempUserData] = useState(userData);

 const handleEdit = () => {
  setTempUserData(userData);
  setIsEditing(true);
 };

 const handleCancel = () => {
  setIsEditing(false);
 };

 const handleSave = () => {
  setUserData(tempUserData);
  setIsEditing(false);
  // اینجا معمولاً یک درخواست API برای ذخیره داده‌ها ارسال می‌شود
 };

 const handleChange = e => {
  const { name, value } = e.target;
  setTempUserData(prev => ({ ...prev, [name]: value }));
 };

 return (
  <div className={styles.dashboard}>
   <header className={styles.header}>
    <h1 className={styles.title}>اطلاعات حساب کاربری</h1>
    <p className={styles.subtitle}>مشاهده و ویرایش اطلاعات شخصی خود.</p>
   </header>

   <motion.div
    className={styles.card}
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, ease: 'easeOut' }}>
    <div className={styles.cardHeader}>
     <h2 className={styles.cardTitle}>جزئیات شخصی</h2>
     {!isEditing && (
      <motion.button
       className={`${styles.button} ${styles.secondaryButton}`}
       onClick={handleEdit}
       whileHover={{ scale: 1.05 }}
       whileTap={{ scale: 0.95 }}>
       <Edit3 size={16} style={{ marginLeft: '8px' }} />
       ویرایش
      </motion.button>
     )}
    </div>

    <div className={styles.cardContent}>
     <div className={styles.formGrid}>
      <div className={styles.formGroup}>
       <label htmlFor='firstName' className={styles.label}>
        نام
       </label>
       <div className={styles.inputWrapper}>
        <User size={18} className={styles.inputIcon} />
        <input
         type='text'
         id='firstName'
         name='firstName'
         value={tempUserData.firstName}
         onChange={handleChange}
         disabled={!isEditing}
         className={styles.input}
        />
       </div>
      </div>
      <div className={styles.formGroup}>
       <label htmlFor='lastName' className={styles.label}>
        نام خانوادگی
       </label>
       <div className={styles.inputWrapper}>
        <User size={18} className={styles.inputIcon} />
        <input
         type='text'
         id='lastName'
         name='lastName'
         value={tempUserData.lastName}
         onChange={handleChange}
         disabled={!isEditing}
         className={styles.input}
        />
       </div>
      </div>
      <div className={`${styles.formGroup} ${styles.fullWidth}`}>
       <label htmlFor='email' className={styles.label}>
        آدرس ایمیل
       </label>
       <div className={styles.inputWrapper}>
        <Mail size={18} className={styles.inputIcon} />
        <input
         type='email'
         id='email'
         name='email'
         value={tempUserData.email}
         onChange={handleChange}
         disabled={!isEditing}
         className={styles.input}
        />
       </div>
      </div>
      <div className={`${styles.formGroup} ${styles.fullWidth}`}>
       <label htmlFor='phone' className={styles.label}>
        شماره تلفن
       </label>
       <div className={styles.inputWrapper}>
        <Smartphone size={18} className={styles.inputIcon} />
        <input
         type='tel'
         id='phone'
         name='phone'
         value={tempUserData.phone}
         onChange={handleChange}
         disabled={!isEditing}
         className={styles.input}
        />
       </div>
      </div>
     </div>
    </div>

    <AnimatePresence>
     {isEditing && (
      <motion.div
       className={styles.actions}
       initial={{ opacity: 0, height: 0 }}
       animate={{ opacity: 1, height: 'auto' }}
       exit={{ opacity: 0, height: 0 }}
       transition={{ duration: 0.3 }}>
       <motion.button
        className={`${styles.button} ${styles.secondaryButton}`}
        onClick={handleCancel}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}>
        <X size={16} style={{ marginLeft: '8px' }} />
        انصراف
       </motion.button>
       <motion.button
        className={`${styles.button} ${styles.primaryButton}`}
        onClick={handleSave}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}>
        <Check size={16} style={{ marginLeft: '8px' }} />
        ذخیره تغییرات
       </motion.button>
      </motion.div>
     )}
    </AnimatePresence>
   </motion.div>
  </div>
 );
};

export default Dashboard;
