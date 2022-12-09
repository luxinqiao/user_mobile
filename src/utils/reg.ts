/**
    校验手机号
    @param phone 手机号
    @return 是否通过校验
 */
const validPhone = (phone: string)=> {
	if (/^(1)[0-9]{10}$/.test(phone)) {
		return true
	}
    return false
}

/**
    转换手机号
    @param phone 手机号
    @return 符合规则的手机号
 */
const convertPhone = (phone: string)=> {
	if (phone.length > 11) {
        phone = phone.slice(0, 11)
    }
    phone = phone.replace(/[^\d]/g, '')
    return phone
}

export {
    validPhone,
    convertPhone
}
