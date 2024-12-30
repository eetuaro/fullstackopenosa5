describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset');

    const user = {
      name: 'Test User',
      username: 'testuser',
      password: 'password123',
    };

    cy.request('POST', 'http://localhost:3003/api/users', user);
    cy.visit('http://localhost:5173');

    cy.get('input[name="Username"]').type('testuser');
    cy.get('input[name="Password"]').type('password123');
    cy.get('button[type="submit"]').click();
  });

  describe('When logged in', function () {
    beforeEach(function () {});

    it('A blog can be created', function () {
      cy.contains('create new blog').click();
      cy.get('input[name="Title"]').type('Test Blog Title');
      cy.get('input[name="Author"]').type('Test Author');
      cy.get('input[name="Url"]').type('http://testblog.com');
      cy.get('button[type="submit"]').click();

      cy.wait(6000);
      cy.contains('Test Blog Title');
    });
  });
});
