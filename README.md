<h1 align="center">Milestone Project 2 - Foodle</h1>

[View the live project here.](https://matttomed.github.io/MS2Foodle/)

For the MS2 brief, I have designed a single-page website that focuses on user responsiveness and interaction to display information based on the user's needs.

I have chosen to use an API that allows me to pull information on recipes based on cuisine, ingredients, dietary requirements and intolerances. The website displays a search in a table format, and allows the user to select a result to see a summary of what they will need to do to recreate the recipe. If errors are thrown resulting in recipe steps not being retrieved, then the website allows for the user to visit the source website. 

The API that is used is the [spoonacular Nutrition, Recipe and Food API.](https://rapidapi.com/spoonacular/api/recipe-food-nutrition/)

![Responsiveness test](docs/responsiveness/responsive.png)
# User Experience (UX)

# Strategy plane

## Importance and Feasibility Scores

The identified needs of the site have been measured according to their importance and the feasibility of addressing those needs: 

*   Increase social media followers
*   Create an online presence
*   Showcase a portfolio
*   Create a blog for new content and to provide articles on photography
*   A place for showcasing positive reviews/feedback

The ranking for these needs is below:

*   Increase social media followers: Importance 5, Feasibility 4
*   Create an online presence: Importance 3, Feasibility 5
*   Showcase a portfolio: Importance 5, Feasibility 5
*   Create a blog for new content and to provide articles on photography: Importance 2, Feasibility 1
*   A place for showcasing positive reviews/feedback: Importance 3, Feasibility 3

As a result, we chose to focus on increasing followers and showcasing a portfolio before addressing other needs.

## Competitor analysis

I have used other local photography websites to establish an idea of what other people are doing, and how they obtain value: 

*    https://thecardiffphotographer.co.uk/
*    https://www.jhwedding.photography/

From analysing these websites, we can infer that value will be obtained through image-based development solutions. 
Ideal users of this site will be: 
*   People interested in photography, art and natural art
*   Individuals looking to purchase prints, commissions or event photography assistance
*   Professionals looking to learn more about Catrin’s portfolio and to find contact details

# Scope plane

*   A carousel of images on the home page
*   Fancybox implementation for site visitors to inspect individual images
*   A logo that supports the website with appropriate branding
*   Parallax effects to separate content, if there is scope
*   Animated/video site backgrounds to increase appeal of the site, if there is scope
*   3D assets using JavaScript libraries such as https://threejs.org/ as an alternative way to showcase images, if there is scope

The first three points will be focused on, with further time being afforded to animation effects either in this build or future development sessions, should these criteria not meet the MVP.

# Structure plane

There is no need for the website to deviate from a linear structure of pages, as this will confuse customers less familiar with non-traditional web design. The website will follow interaction design objectives as outlined below:

*   Consistency – Pages must look, feel and interact in a consistent way. This applies to link :hover and :active behaviours as well as moving parts of the website, such as the carousel

*   Predictability – The website must respond in a predictable manner - particularly important for when users click on images as part of the Portfolio section

*   Learnability – Features must be intuitive and feature single-click learning to prevent visitors becoming frustrating and clicking away, particularly important for capturing user data on the Contact section

*   Visibility – Features must be visible, with content hinting included as appropriate

*   Feedback – Input fields and clickable events should respond in a way that assures the user that an event is progressing. This includes a broken link page, but this will be outside the scope of this project. Feedback will be provided on the Contact form if incorrect data is entered, or if a required field is missing.

# Skeleton plane

## Wireframes

-   Home Page Wireframe - [View](wireframes/wireframehome.png)

-   Portfolio Wireframe - [View](wireframes/wireframeportfolio.png)

-   Contact Wireframe - [View](wireframes/wireframecontact.png)

-   About Wireframe - [View](wireframes/wireframeabout.png)
    
# Surface plane

## Colour Scheme
A natural style has been chosen for this website, using a mix of light and dark green. Gradients are used in the background.

## Typography
Source Serif Pro is used for titles to evoke a sense of style and elegance. Open Sans was chosen as a complementary paragraph font.

## Imagery
A carousel has been used to bring Catrin's photos front and centre upon first visiting. This comes at the potential cost of an increased initial load for first-time visitors to the website, but this has been mitigated as much as possible without sacrificing image quality.

# User stories

## First Time Visitor Goals

1. As a First Time Visitor, I want to easily understand the main purpose of the site and learn more about the photographer.
2. As a First Time Visitor, I want to be able to easily navigate throughout the site to find examples of Catrin's photography.

## Returning Visitor Goals

1. As a Returning Visitor, I want to be able to find a way to contact Catrin for the purposes of engaging with her services.
2. As a Returning Visitor, I want to find a way to engage with Catrin through social media.

## Features

-   Responsive on all device sizes

-   Fancybox implementation to preview images at full size without affecting initial loading times

-   Contact form that is connected to the info dump at CI

-   Carousel implementation to add visual appeal and extra display of photos

## Technologies Used

### Languages Used

-   [HTML5](https://en.wikipedia.org/wiki/HTML5)
-   [CSS3](https://en.wikipedia.org/wiki/Cascading_Style_Sheets)

### Frameworks, Libraries & Programs Used

1. [Bootstrap 5:](https://getbootstrap.com/)
    - Bootstrap was used to assist with the responsiveness and styling of the website.
1. [Google Fonts:](https://fonts.google.com/)
    - Google Fonts have been used: Source Serif Pro and Open Sans.
1. [Font Awesome:](https://fontawesome.com/)
    - Font Awesome has been used for icons used in parts of the site.
1. [jQuery:](https://jquery.com/)
    - jQuery was required to enable Bootstrap and Fancybox features.
1. [Git](https://git-scm.com/)
    - Git has been used as a version control system, which enables viewers to see the deployment history and design process. Github has been used as a storage for this info.
1. [GIMP:](https://www.gimp.org/)
    - GIMP was used to resize images, export to .jpg and .png and recolour some images.
1. [Balsamiq:](https://balsamiq.com/)
    - Balsamiq has been used for the wireframes attached to this project.
1. [Fancybox:](https://fancyapps.com/fancybox/3/)
    - Fancybox has been implemented to allow users to click on photos, gain a better view of images and to browse through the portfolio in an easy to use gallery function.

## Testing

The W3C Markup Validator and W3C CSS Validator Services were used to validate every page of the project to ensure there were no syntax errors in the project.

-   [W3C Markup Validator](https://jigsaw.w3.org/css-validator/#validate_by_input) - All pages pass with no errors.
-   [W3C CSS Validator](https://jigsaw.w3.org/css-validator/#validate_by_input) - CSS file passes with no errors.

### Testing User Stories from User Experience (UX) Section

-   #### First Time Visitor Goals

    1. As a First Time Visitor, I want to easily understand the main purpose of the site and learn more about the photographer.

        Upon entering the site, users are able to access a clean and contrasted navigation bar to select the Portfolio, About or Contact sections easily. They are also immediately draen to the carousel, that rotates through three photos, each with a differing CTA that link to the other pages on the site. Content hinting has been implemented to encourage readers to scroll down.


    2. As a First Time Visitor, I want to be able to easily navigate throughout the site to find examples of Catrin's photography.

        The website has been designed to be linear and should be familiar with the majority of internet users. The website clearly labels the destination of any links that can be clicked, and external links open in a new tab as per standard practice. The portfolio section contains images that are clickable and navigate to an easy to use gallery, which is also responsive to mobile devices. The background fades to black to ensure visual noise does not distract from the browsing experience.


-   #### Returning Visitor Goals

    1. As a Returning Visitor, I want to be able to find a way to contact Catrin for the purposes of engaging with her services.

        There are clear CTAs and links to the contact page, whereupon users are taken through a simple-to-use form that clearly labels what information is required and what information to input in each data box. The form currently links to the CI info dump page, but in future builds will link to relevant databases for processing. 

    2. As a Returning Visitor, I want to find a way to engage with Catrin through social media.

        Social media links are included in the footer on all pages as per standard practice, and are also included in the About page where people are most likely to visit to learn more about Catrin's work. Depending on Catrin's frequency when posting, this indirectly addresses the need for a blog, but as social media accounts operate independently of the site, this frees up resources that can be used to achieve other aims. Currently, the links navigate to the general homepages of the social media links in question. 

### Responsiveness

-   The home page consists of a carousel that removes descriptive text in favour of just a title and a CTA whe viewed on mobile. This ensures there is enough space for the photo to still be visible. Columns stack on top of one another when viewed on mobile devices and smaller tablets. 
-   The portfolio contains a 3 by 4 grid of photos, which shrinks to a 2 by 6 or 1 by 12 grid depending on screen size.
-   The About page stacks columns on top of one another on smaller screens. The header text's size remains consistently large over the image displayed.
-   The Contact page stacks columns on top of one another, while also respecting the size of the form on the page.
-   The header arranged links into a clickable menu that hides links when disabled. This ensures there is more screen space that can be used.
-   The footer stacks content vertically to ensure social media links are still clickable.

### Further Testing

-   The website's pages achieve 90+ scores for Performance, Accessibility, Best Practices and SEO on Google Chrome's Lightbox testing feature.
-   The website has been tested using Chrome Developer Tools to ensure any interactions operate correctly (through manually enabling selectors such as :hover or :active)
-   The website was viewed on desktop and mobile devices.
-   Catrin viewed the site and suggested changes and alterations.

### Known Bugs

-   Images can sometimes cause the Lightbox score to dip below 90 - a balance has been sought to achieve quick loading times without sacrificing image quality, but this could do with further tweaking or redesign in future updates.

## Credits

### Code

-   [Bootstrap5](https://getbootstrap.com/): The Bootstrap library has been used for its ease in implementing mobile-first design. My custom CSS builds on this to create a website that feels more unique.

-   [Fancybox](https://fancyapps.com/fancybox/3/): The Fancybox Javascript lightbox library was recommended as an easy way to enable users to preview images in a way that does not impact performance, while maintaining responsiveness. 


### Content

-   CodeInstitute's sample README was used as a guide on how to document a comprehensive design process, and I used this template to inform the layout of my own design journey.


### Media

-   All images were created by Catrin.

### Acknowledgements

-   Guido Cecilio for useful and helpful feedback during mentoring sessions.

-   Code Institute for the Slack channel and tutor support when encouring technical issues or sudden Gitpod updates.

-   Catrin for the images.

-   The owners of the two example websites I browsed for ideas on how to create an appropriate website, JH Weddings and The Cardiff Photographer.
