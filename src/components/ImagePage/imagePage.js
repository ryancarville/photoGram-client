import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PhotoGramContext from '../../PhotoGramContext';
import config from '../../config';
import './imagePage.css';

export default class ImagePage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: this.props.location.state.id,
			img_url: this.props.location.state.img_url,
			alt: this.props.location.state.tags,
			caption: this.props.location.state.caption,
			date: this.props.location.state.date,
			error: null
		};
	}

	static contextType = PhotoGramContext;

	//handle back event
	handleBack = e => {
		this.props.history.goBack();
	};
	//delete request event handle sent to context
	deleteImageRequest = (imageId, cd) => {
		cd(imageId);
		this.handleBack();
	};

	render() {
		const userId = this.props.match.params.user_id;
		return (
			<PhotoGramContext.Consumer>
				{context => (
					<>
						<button
							type='button'
							id='imagePageBackBtn'
							onClick={this.handleBack}>
							&#171;{' '}
						</button>
						<div className='image-page-container'>
							<img
								key={this.state.id}
								src={this.state.img_url}
								alt={this.state.alt}
								className='singleImg'
							/>
							<div className='image-info'>
								<p>{this.state.caption}</p>
								<span>Date:{this.state.date}</span>

								<div className='imageButtons'>
									<Link to={`/users/${userId}/edit/${this.state.id}`}>
										<button type='button'>Edit Post</button>
									</Link>
									<button
										type='button'
										onClick={() =>
											this.deleteImageRequest(
												this.state.id,
												context.deleteImage
											)
										}>
										Delete
									</button>
								</div>
							</div>
						</div>
					</>
				)}
			</PhotoGramContext.Consumer>
		);
	}
}
