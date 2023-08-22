# Test Assignment

The test assignment aims to validate your expertise and skills as a JS Fullstack developer proficient in participating in our commercial projects.

You are given an existing repository, which is a simple admin area. Your tasks will be briefed below. You must fork the repositories, understand the existing code, and process tasks according to your understanding of SDLC: assess requirements, ask questions, communicate a solution approach, and likely estimate, develop, and deliver. Your developed increment shall sit in a separate feature branch of at least 3+ commits and prove your Git skills and development proficiency.

[Admin Boilerplate SPA Repository](https://github.com/liveart/admin-boilerplate-spa)
[Admin Boilerplate API Repository](https://github.com/liveart/admin-boilerplate-api)

To qualify, we expect a proper understanding of the development process, clear communication, and completion of at least one task. Completing all three tasks is optional if you show good code navigation and your solution roadmap is solid and transparent.

## TASK03
As an admin, I want to be able to create tags and tag products or categories so that I can mark any product or category with tags like "needs-review" or "draft."
1. On the table or details view, tags shall be rendered using chips component;
2. To simplify the implementation, the admin shall be able to choose tags from existing ones that are managed via a separate panel;

### Subtask (Backend): Created tag model in loopback. Created repository. Created controller.
### Subtask (Backend): Established relationship between tags and products. Products can have multiple tags. Modified the product model and add a product array.
### Subtask (Backend): Developed endpoints for creating, editing, deleting, and viewing tags. Endpoints that will manage tags and save them to products. Added functionality to tag and product controllers.
### Subtask (Frontend): Implemented a tag management interface. Created a page for creating, editing, and deleting tags. A component has been created, routing added, models, interfaces, and DTO added, functionality added.
### Subtask (Frontend): Displayed tags as "chips" on the product detail page. When viewing a product or category, all related tags displayed as "chips" or tokens. A request to retrieve all tags has been added to the productPage. A component displaying tags - ProductTags, receiving props tags, has been added.
### Subtask (Frontend): Component with a tag cloud from which tags are selected. The administrator can choose tags from the existing ones to add them to the products. ProductTags has been changed - all tags are added as props. Depending on what is passed, the display is generated and events are emitted.

## TASK02 - NOT COMPLETED
As an admin, I can mark a product as "hidden" to hide the products I don't want shown on the storefront.
Implementation notes:
1. Create a new product endpoint that lists all available products except the ones marked as "hidden". We do not have a storefront yet imagine there will be one that needs a list of all visible products;
2. In the admin product table view, the "hidden" products shall be marked with [eye-slash icon](https://fontawesome.com/icons/eye-slash?f=classic&s=regular) and a "This product is hidden" tooltip.

### Subtask 1 (Backend): Added a "hidden" field to the product model.
### Subtask 2 (Backend): Developed endpoint to get only visible products. Endpoint `/visible-products` implemented.
### Subtask 3 (Frontend): Added an icon and a tooltip for hidden products. An icon with the tooltip "This product is hidden" has been implemented. A component with an SVG icon and a tooltip for it has been added.

## TASK01
As an admin, I shall be able to upload a thumbnail to the product and preview it in the list of products.
1. Only .jpg and .png shall be allowed;
2. The preview shall be rendered as 100x100px;
3. The allowed size shall be 1Mb max;

Questions:
- Are the images stored in MongoDB?
- In what form is the link, BinData, GridFS, Base64?

### Subtask 1 (Backend): Endpoint for uploading images.
### Subtask 2 (Backend): Add to the product model.
### Subtask 3 (Backend): Image validation.
### Subtask 1 (Frontend): Add an image upload form with a thumbnail display and front-end verification.
### Subtask 2 (Frontend): Implement image preview.