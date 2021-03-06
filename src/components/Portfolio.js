import React, { useState, useEffect } from 'react';
import { useStaticQuery, graphql, navigate } from 'gatsby';
import { useLocation } from '@reach/router';
import { Swipeable } from 'react-swipeable';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Header from './Header';
import Footer from './Footer';
import Button from './Button';
import ProjectAsset from './ProjectAsset';
import Archive from './Archive';
import SEO from './seo';

const Portfolio = () => {
	const data = useStaticQuery(graphql`
		{
			allSanitySiteSettings {
				nodes {
					projectOrder {
						_key
						credits {
							_key
							name
							_type
							task
						}
						isFullScreen
						title
						projectThumbnail {
							image {
								asset {
									url
								}
							}
							video {
								asset {
									url
								}
							}
						}
						projectAsset {
							_key
							_type
							video {
								_key
								asset {
									url
									childImageSharp {
										id
									}
								}
							}
							image {
								_key
								_type
								asset {
									fixed {
										base64
										aspectRatio
										width
										height
										src
										srcSet
										srcWebp
										srcSetWebp
									}
									fluid {
										base64
										aspectRatio
										src
										srcSet
										srcWebp
										srcSetWebp
										sizes
									}
									url
									id
								}
							}
							photoLayout
						}
					}
				}
			}
		}
	`);
	const location = useLocation();
	const { search } = location;

	const [isInfoVisible, setInfoVisible] = useState(false);
	const [isIndexVisible, setIndexVisible] = useState(false);

	const [projects] = useState(data.allSanitySiteSettings.nodes[0].projectOrder);

	const [currentProject, setCurrentProject] = useState(
		data.allSanitySiteSettings.nodes[0].projectOrder[0],
	);

	const [index, setIndex] = useState(0);

	const toggleLeft = () => {
		let newIndex = index - 1;
		if (newIndex < 0) {
			newIndex = projects.length - 1;
		}
		const element = document.querySelector('.project-asset');
		element.classList.remove('visible');
		setIndex(newIndex);
		setCurrentProject(projects[newIndex]);
	};

	const toggleRight = () => {
		let newIndex = index + 1;
		if (newIndex >= projects.length) {
			newIndex = 0;
		}
		const element = document.querySelector('.project-asset');
		element.classList.remove('visible');
		setIndex(newIndex);
		setCurrentProject(projects[newIndex]);
	};

	const clickOutsideInformation = e => {
		if (
			e.target.nodeName === 'P' ||
			e.target.nodeName === 'A' ||
			e.target.nodeName === 'SPAN' ||
			e.target.nodeName === 'DIV' ||
			e.target.nodeName === 'BUTTON' ||
			e.target.nodeName === 'IMG' ||
			e.target.nodeName === 'VIDEO'
		)
			return;

		navigate('/', {
			replace: true,
		});
		setInfoVisible(false);
		setIndexVisible(false);
	};

	useEffect(() => {
		switch (search) {
			case '?information':
				setInfoVisible(true);
				setIndexVisible(false);
				break;
			case '?index':
				setInfoVisible(false);
				setIndexVisible(true);
				break;
			default:
				setInfoVisible(false);
				setIndexVisible(false);
				break;
		}

		if (projects.length) {
			const interval = setInterval(() => {
				if (index === projects.length - 1) {
					setIndex(0);
					setCurrentProject(projects[0]);
					return;
				} else {
					setCurrentProject(projects[index + 1]);
					setIndex(index + 1);
				}
			}, 15000);
			return () => clearInterval(interval);
		}
	}, [projects, index, search]);

	return (
		<main
			className={classNames('portfolio', {
				fullscreen: currentProject.isFullScreen,
			})}
			id={isInfoVisible ? 'information' : ''}>
			<SEO title='JAROD TABER' />

			<Header visible={isInfoVisible} onClick={clickOutsideInformation} />
			<Archive
				setIndexVisible={setIndexVisible}
				isIndexVisible={isIndexVisible}
				projects={projects}
				setCurrentProject={setCurrentProject}
				setIndex={setIndex}
				onClick={clickOutsideInformation}
			/>

			<aside
				className={classNames('title', {
					'title--index': isIndexVisible,
				})}>
				<button
					className='jarod'
					onClick={() => {
						navigate('/', {
							replace: true,
						});
						setInfoVisible(false);
						setIndexVisible(false);
					}}>
					Jarod Taber
				</button>
				<button
					className='information'
					onClick={() => {
						if (!isInfoVisible) {
							navigate('/?information', {
								replace: true,
							});
							setInfoVisible(true);
						} else {
							navigate('/', {
								replace: true,
							});
							setInfoVisible(false);
						}
					}}>
					Information
				</button>
				<button
					className='index'
					onClick={() => {
						if (!isIndexVisible) {
							navigate('/?index', {
								replace: true,
							});
							setIndexVisible(true);
						} else {
							navigate('/', {
								replace: true,
							});
							setIndexVisible(false);
						}
					}}>
					Index
				</button>
			</aside>

			<Swipeable onSwipedRight={toggleLeft} onSwipedLeft={toggleRight}>
				<Button className='left' onClick={toggleLeft}>
					<div className='circle' />
				</Button>

				{projects.map(project => {
					return (
						<ProjectAsset
							asset={{
								isFullScreen: project.isFullScreen,
								projectAsset: project.projectAsset,
								alt: project.title,
								isCurrent: project === currentProject,
							}}
							key={project.title}
						/>
					);
				})}

				<Button className='right' onClick={toggleRight}>
					<div className='circle' />
				</Button>
			</Swipeable>
			<Footer isFullScreen={currentProject.isFullScreen} credits={currentProject.credits} />
		</main>
	);
};

Portfolio.propTypes = {
	children: PropTypes.node.isRequired,
};

export default Portfolio;
