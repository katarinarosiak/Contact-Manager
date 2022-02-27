/* eslint-disable max-lines-per-function */
class Contact {
	constructor(id, full_name, email, phone_number, tags) {
		this.id = id;
		this.full_name = full_name;
		this.email = email;
		this.phone_number = phone_number;
		this.tags = this._tagsToArr(tags);
	}

	_tagsToStr(tags) {
		return tags.join(',');
	}

	_tagsToArr(tags) {
		if (tags === '' || tags === null) {
			return [];
		} else {
			return tags.split(',');
		}
	}

}



class Model{
	constructor() {
		this.contactsData = [];
		this.availableTags = ['work', 'friend'];
	}

	getContacts(callback) {
		let request = new XMLHttpRequest(); 
		request.open('GET', 'http://localhost:3000/api/contacts'); 
		request.responseType = 'json';

		request.addEventListener('error', () => {
				alert('There was a problem with loading the data.'); 
		})
		request.addEventListener('load', () => {
				if (request.status === 200) {
					this._addToLocal(request.response); 
					callback(this.contactsData); 
				} else {
					alert(request.response); 
				}

		}); 
		request.send(); 
	}

	createNewContact(callback, data) {
		let request = new XMLHttpRequest(); 
		request.open('POST', 'http://localhost:3000/api/contacts'); 
		request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
		request.responseType = 'json';

		request.addEventListener('error', () => {
				alert('There was a problem with loading the data.'); 
		});
		request.addEventListener('load', () => {
			if (request.status === 201) {
				this._addToLocal(request.response); 
				callback(this.contactsData); 
				alert('Contact created successfully');  
			} else {
				alert(request.response); 
			}
		}); 
		request.send(data);  
	}

	updateContact(id, newData, callback) {
		let request = new XMLHttpRequest(); 
		request.open('PUT', `http://localhost:3000/api/contacts/${id}`); 
		request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
		request.responseType = 'json';

		request.addEventListener('error', () => {
				alert('There was a problem with loading the data.'); 
		});
		request.addEventListener('load', () => {
				if (request.status === 201) {
					this._addToLocal(request.response)
					callback(this.contactsData);
					alert('Contact updated successfully');  
				} else {
					alert(request.status); 
				}
		}); 
		request.send(newData); 
	}

	deleteContact(id, callback) {
		let request = new XMLHttpRequest(); 
		request.open('DELETE', `http://localhost:3000/api/contacts/${id}`);

		request.addEventListener('error', () => {
				alert('There was a problem with loading the data.'); 
		});
		request.addEventListener('load', () => { 
				if (request.status === 204) {
					callback(); 
					alert('The contact has been removed successfully'); 
				} else {
					alert(request.status); 
				}
		}); 

		request.send();
	}

	submitFormData(form, callback, contactId) {
		let json = this._serialzeFormDataToJSON(form);
		if (contactId) {
			this.updateContact(contactId, json, callback)
		} else {
			this.createNewContact(callback, json);
		}
	}

	addToAvaialableTags(newTag) { 
		if (!this.availableTags.includes(newTag)) {
			this.availableTags.push(newTag);
			return this.availableTags;
		} else {
			return false; 
		}
	}

	searchContactsByName(event) {
		let pattern = event.target.value; 
		return this.contactsData.filter(obj => {
				return this._suitsPattern(obj.full_name, pattern); 
		})
	}

	searchContactsByTag(event) {
		let pattern = event.target.value;
		if (pattern === '') {
				return this.contactsData;
		} else {
				return this.contactsData.filter(obj => {
					return obj.tags.find(tag => this._suitsPattern(tag, pattern))
					});
		}  
	}

	_suitsPattern(name, pattern) {
		pattern = this._escapeRegex(pattern);
		let RE = new RegExp(pattern, 'gi'); 
		return RE.test(name);  
	}
	
	_escapeRegex(string) {
		return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}

	_addToLocal(contacts) {
		if (Array.isArray(contacts)) { 
			let newContacts = []; 
			contacts.forEach(contact => {
				let newContact = new Contact(contact.id, contact.full_name, contact.email, contact.phone_number, contact.tags); 
				newContacts.push(newContact);
			});
			this.contactsData = newContacts;
		} else {
			let contact = this.findContactById(contacts.id);
			if (contact) {
				let idx = this.contactsData.indexOf(contact);
				this.contactsData[idx] = new Contact(contacts.id, contacts.full_name, contacts.email, contacts.phone_number, contacts.tags);
			} else {
				let newContact = new Contact(contacts.id, contacts.full_name, contacts.email, contacts.phone_number, contacts.tags); 
				this.contactsData.push(newContact);
			}
		}
	}

	_serialzeFormDataToJSON(form) {
		let data = {};
		let tags = [];

		let inputs = form.querySelectorAll('input');

		inputs.forEach(el => {
			if (el.classList.contains('tagCheckbox') && el.checked) {
				tags.push(el.id);
			} else {
				data[el.getAttribute('name')] = el.value;  
			}
		})
		data.tags = tags.join(',');
		return  JSON.stringify(data);
}
	findContactById(id) {
		return this.contactsData.find(obj => obj.id === +id);
	}
}


export default Model;