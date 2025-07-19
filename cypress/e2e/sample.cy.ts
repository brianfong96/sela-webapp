// @ts-check

describe('Navigation', { tags: '@smoke' }, () => {
  it('loads the sign up page', () => {
    cy.visit('/sign-up');
    cy.contains('SignUp');
  });
});
