describe('Blog app', function () {
  const user = {
    name: 'Test User',
    username: 'testuser',
    password: 'password123',
  };

  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset');

    cy.request('POST', 'http://localhost:3003/api/users', user);
    cy.visit('http://localhost:5173');

    cy.get('input[name="Username"]').type(user.username);
    cy.get('input[name="Password"]').type(user.password);
    cy.get('button[type="submit"]').click();
  });

  describe('When logged in', function () {
    it('A blog can be liked', function () {
      cy.contains('create new blog').click();
      cy.get('input[name="Title"]').type('Test Blog');
      cy.get('input[name="Author"]').type('Test Author');
      cy.get('input[name="Url"]').type('http://testblog.com');
      cy.get('button[type="submit"]').click();

      cy.contains('Test Blog');

      cy.contains('view').click();

      cy.contains('like').should('be.visible');

      cy.contains('like').click();
      cy.contains('likes: 1');

      cy.contains('like').click();
      cy.contains('likes: 2');
    });
  });
});
