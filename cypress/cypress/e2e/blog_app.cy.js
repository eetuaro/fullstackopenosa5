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
  });

  it('Login form is shown', function () {
    cy.get('form').should('exist');
    cy.get('input[name="Username"]').should('exist');
    cy.get('input[name="Password"]').should('exist');
    cy.get('button[type="submit"]').should('exist');
  });

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('input[name="Username"]').type('testuser');
      cy.get('input[name="Password"]').type('password123');
      cy.get('button[type="submit"]').click();

      cy.contains('Test User logged in');
    });

    it('fails with wrong credentials', function () {
      cy.get('input[name="Username"]').type('testuser');
      cy.get('input[name="Password"]').type('wrongpassword');
      cy.get('button[type="submit"]').click();

      cy.contains('wrong credentials');
      cy.get('html').should('not.contain', 'Test User logged in');
    });
  });
});
