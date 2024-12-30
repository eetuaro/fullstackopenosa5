describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset');

    const user = {
      name: 'Test User',
      username: 'testuser',
      password: 'password123',
    };

    const anotherUser = {
      name: 'Another User',
      username: 'anotheruser',
      password: 'password456',
    };

    cy.request('POST', 'http://localhost:3003/api/users', user);
    cy.request('POST', 'http://localhost:3003/api/users', anotherUser);
    cy.visit('http://localhost:5173');

    cy.get('input[name="Username"]').type('testuser');
    cy.get('input[name="Password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.contains('create new blog').click();
    cy.get('input[name="Title"]').type('Test Blog Title');
    cy.get('input[name="Author"]').type('Test Author');
    cy.get('input[name="Url"]').type('http://testblog.com');
    cy.get('button[type="submit"]').click();

    cy.contains('Test Blog Title');
    cy.get('button').contains('logout').click();
  });

  it('A blog can be deleted by the user who added it', function () {
    cy.get('input[name="Username"]').type('testuser');
    cy.get('input[name="Password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.contains('Test Blog Title')
      .parent()
      .find('button')
      .contains('view')
      .click();
    cy.contains('Test Blog Title')
      .parent()
      .find('button')
      .contains('delete')
      .click();

    cy.on('window:confirm', () => true);
    cy.get('html').should('not.contain', 'Test Blog Title Test Author');
  });

  it('Only the user who added the blog sees the delete button', function () {
    cy.get('input[name="Username"]').type('anotheruser');
    cy.get('input[name="Password"]').type('password456');
    cy.get('button[type="submit"]').click();

    cy.contains('Test Blog Title')
      .parent()
      .find('button')
      .contains('view')
      .click();
    cy.contains('Test Blog Title').parent().should('not.contain', 'remove');
  });
});
