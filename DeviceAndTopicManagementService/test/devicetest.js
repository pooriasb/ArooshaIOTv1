const getUserDeviceList = require('./getUserDeviceList');

describe('getUserDeviceList', () => {
  it('should return an array of documents when documents exist', async () => {
    const userId = '123';

    // Mock the DeviceDocument.find method to return a sample array of documents
    const mockFind = jest.fn().mockReturnValueOnce([
      { deviceName: 'Device 1', deviceModel: 'Model 1', Topic: 'Topic 1', MacAddress: 'Mac Address 1' },
      { deviceName: 'Device 2', deviceModel: 'Model 2', Topic: 'Topic 2', MacAddress: 'Mac Address 2' }
    ]);
    jest.doMock('./DeviceDocument', () => ({
      find: mockFind
    }));

    const result = await getUserDeviceList(userId);

    expect(mockFind).toHaveBeenCalledWith({ userId: userId });
    expect(result).toEqual([
      { deviceName: 'Device 1', deviceModel: 'Model 1', Topic: 'Topic 1', MacAddress: 'Mac Address 1' },
      { deviceName: 'Device 2', deviceModel: 'Model 2', Topic: 'Topic 2', MacAddress: 'Mac Address 2' }
    ]);
  });

  it('should return an empty array when no documents exist', async () => {
    const userId = '456';

    // Mock the DeviceDocument.find method to return an empty array
    const mockFind = jest.fn().mockReturnValueOnce([]);
    jest.doMock('./DeviceDocument', () => ({
      find: mockFind
    }));

    const result = await getUserDeviceList(userId);

    expect(mockFind).toHaveBeenCalledWith({ userId: userId });
    expect(result).toEqual([]);
  });

  it('should throw an error when an error occurs during finding documents', async () => {
    const userId = '789';

    // Mock the DeviceDocument.find method to throw an error
    const mockFind = jest.fn().mockRejectedValueOnce(new Error('Error finding documents'));
    jest.doMock('./DeviceDocument', () => ({
      find: mockFind
    }));

    await expect(getUserDeviceList(userId)).rejects.toThrow('Error finding documents');
  });
});
