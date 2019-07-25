import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import PhotoGramContext from '../../PhotoGramContext';
import config from '../../config';
import { Image, Transformation } from 'cloudinary-react';
import './uploadProfileImage.css';

class UploadProfileImage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			uploadedImage: '',
			profile_img_url: '',
			full_name: '',
			user_name: '',
			widget: window.cloudinary.createUploadWidget(
				{
					cloudName: config.CLOUDINARY_NAME,
					uploadPreset: config.CLOUDINARY_PROFILE_UPLOAD_PRESET,
					cropping: 'server'
				},
				(error, result) => {
					if (!error && result && result.event === 'success') {
						console.log('Done! Here is the image info: ', result.info);
						this.setState({
							uploadedImage: result.info.public_id,
							profile_img_url:
								'https://res.cloudinary.com/rcarville/image/upload/' +
								result.info.public_id
						});
					}
				}
			)
		};
	}

	static contextType = PhotoGramContext;

	handleNameChange = e => {
		this.setState({
			full_name: e.target.value
		});
	};
	handleUserNameChange = e => {
		this.setState({
			user_name: e.target.value
		});
	};
	handleSubmit = e => {
		e.preventDefault();
		const { profile_img_url, full_name, user_name } = this.state;
		const newUserInfo = { profile_img_url, full_name, user_name };
		this.context.handleUserInfoChange(newUserInfo);
	};
	openWidget = () => {
		this.state.widget.open();
	};

	componentDidMount() {
		this.setState({
			full_name: this.context.user.name,
			user_name: this.context.user.user_name,
			profile_img_url: this.context.user.profile_img_url
		});
	}
	render() {
		return (
			<PhotoGramContext.Consumer>
				{context => (
					<div className='updateProfile'>
						<Dropzone
							id='direct-upload-dropzone'
							disableClick={true}
							multiple={false}
							accept='image/*'
							style={{ position: 'relative' }}
							onDrop={this.onDrop}>
							{() => (
								<div id='profile_update'>
									<h1>Update Profile Info</h1>
									<h2>
										You can change your Full Name, User Name or Profile Image
									</h2>

									<form onSubmit={this.handleSubmit}>
										<div className='form_line'>
											<label path='full_name'>Name:</label>
											<div className='form_controls'>
												<input
													type='text'
													className='form-control'
													value={this.state.full_name}
													placeholder={context.user.name}
													onChange={this.handleNameChange}
												/>
											</div>
										</div>
										<div className='form_line'>
											<label path='user_name'>User Name:</label>
											<div className='form_controls'>
												<input
													type='text'
													className='form-control'
													value={this.state.user_name}
													placeholder={context.user.user_name}
													onChange={this.handleUserNameChange}
												/>
											</div>
										</div>
										<div className='form_line'>
											<label htmlFor='fileUpload'>Upload Image</label>
											<div className='form_control'>
												<Image
													cloudName={config.CLOUDINARY_NAME}
													publicId={this.state.uploadedImage}>
													<Transformation
														height='100'
														width='100'
														crop='scale'
														radius='100'
													/>
												</Image>
												<br />
												<button
													type='button'
													id='fileUplaod'
													onClick={this.openWidget}>
													Upload Image
												</button>
											</div>
										</div>
										<button type='submit'>Save Changes</button>
									</form>
								</div>
							)}
						</Dropzone>
					</div>
				)}
			</PhotoGramContext.Consumer>
		);
	}
}

export default UploadProfileImage;
