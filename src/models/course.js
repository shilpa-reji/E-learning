const course = (sequelize, DataTypes) => {
    const course = sequelize.define('course', {
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      duration: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      startTime: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      endTime: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0,
    },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    });
    course.associate = (models) => {
        course.belongsTo(models.users, {
        foreignKey: 'userId',
        as: 'user',
      });
    };
    return course;
  };
  export default course;