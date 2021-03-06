require('dotenv').config();
module.exports = {
	siteMetadata: {
		title: `Jarod Taber`,
		description: `Jarod Taber is an Art Director, producer, and filmmaker based in New York City, working with a diverse range of clients in art, fashion, music, and film.`,
		author: `Buena Suerte Studio <info@buena-suerte.studio>`,
	},
	plugins: [
		`gatsby-plugin-react-helmet`,
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				name: `images`,
				path: `${__dirname}/src/images`,
			},
		},
		`gatsby-transformer-sharp`,
		`gatsby-plugin-sharp`,
		{
			resolve: `gatsby-plugin-manifest`,
			options: {
				name: `gatsby-starter-default`,
				short_name: `starter`,
				start_url: `/`,
				background_color: `#663399`,
				theme_color: `#663399`,
				display: `minimal-ui`,
				icon: `src/images/favicon/apple-icon.png`, // This path is relative to the root of the site.
			},
		},
		{
			resolve: 'gatsby-source-sanity',
			options: {
				projectId: process.env.GATSBY_SANITY_PROJECT_ID,
				dataset: process.env.GATSBY_SANITY_DATASET,
				token: process.env.GATSBY_SANITY_API_TOKEN,
				// watchMode: true,
				// overlayDrafts: true
			},
		},
		`gatsby-plugin-sass`,
		// this (optional) plugin enables Progressive Web App + Offline functionality
		// To learn more, visit: https://gatsby.dev/offline
		// `gatsby-plugin-offline`,
	],
};
