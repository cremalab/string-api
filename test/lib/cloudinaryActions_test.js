'use strict'
const actions = require('../../lib/cloudinaryActions')
const expect   = require('chai').expect

describe('cloudinaryActions', function() {
  describe('generateUploadParams', () => {
    it('should return an object', () => {
      expect(actions.generateUploadParams()).to.be.an('object')
    })
    it('should have a signature', () => {
      expect(actions.generateUploadParams()).to.have.property('signature')
    })
    it('should have a upload_url', () => {
      expect(actions.generateUploadParams()).to.have.property('upload_url')
    })
  })
})
