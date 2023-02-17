const user = (sequelize, DataTypes) => {
    const user = sequelize.define('users', {
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      userCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      emailId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phoneNo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      jwtToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    });
    user.associate = (models) => {
      
      user.hasMany(models.course, {
        foreignKey: 'userId',
        as: 'course',
      });
      
    };
    return user;
  };
  export default user;