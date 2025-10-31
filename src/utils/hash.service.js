import bcrypt from 'bcrypt';

class HashService {
  async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  async comparePasswords(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}

export const hashService = new HashService();
