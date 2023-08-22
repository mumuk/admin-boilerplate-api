import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response, HttpErrors,
} from '@loopback/rest';
import {Product, ProductWithRelations} from '../models';
import {ProductRepository, TagRepository} from '../repositories';



export class ProductController {
  constructor(
    @repository(ProductRepository)
    public productRepository: ProductRepository,
    @repository(TagRepository)
    public tagRepository: TagRepository,  // Добавьте эту строку
  ) {
  }

  @post('/products')
  @response(200, {
    description: 'Product model instance',
    content: {'application/json': {schema: getModelSchemaRef(Product)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {
            title: 'NewProduct',
            exclude: ['id'],
          }),
        },
      },
    })
      product: Omit<Product, 'id'>,
  ): Promise<Product> {
    return this.productRepository.create(product);
  }

  @get('/products/count')
  @response(200, {
    description: 'Product model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Product) where?: Where<Product>,
  ): Promise<Count> {
    return this.productRepository.count(where);
  }

  @get('/products')
  @response(200, {
    description: 'Array of Product model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Product, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Product) filter?: Filter<Product>,
  ): Promise<Product[]> {
    const products = await this.productRepository.find(filter);
    await Promise.all(products.map(async (product) => {
      product.tags = await this.tagRepository.find({
        where: {
          _id: {
            in: product.tagIds
          }
        }
      });
    }));
    return products;
  }

  @get('/visible-products')
  @response(200, {
    description: 'Array of visible Product model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Product, {includeRelations: true}),
        },
      },
    },
  })
  async findVisible(): Promise<Product[]> {
    try {
      const products = await this.productRepository.find({where: {hidden: false}});
      await Promise.all(products.map(async (product) => {
        product.tags = await this.tagRepository.find({
          where: {
            _id: {
              in: product.tagIds
            }
          }
        });
      }));
      return products;
    } catch (e) {
      throw new HttpErrors.InternalServerError(
        'Error retrieving visible products',
      );
    }
  }

  @patch('/products')
  @response(200, {
    description: 'Product PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {partial: true}),
        },
      },
    })
      product: Product,
    @param.where(Product) where?: Where<Product>,
  ): Promise<Count> {
    return this.productRepository.updateAll(product, where);
  }

  @get('/products/{id}')
  @response(200, {
    description: 'Product model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Product, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Product, {exclude: 'where'}) filter?: FilterExcludingWhere<Product>
  ): Promise<ProductWithRelations> {
    const product = await this.productRepository.findById(id, filter);

    product.tags = await this.tagRepository.find({
      where: {
        _id: {
          in: product.tagIds
        }
      }
    });

    return product;
  }

  @patch('/products/{id}')
  @response(204, {
    description: 'Product PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {partial: true}),
        },
      },
    })
      product: Product,
  ): Promise<void> {
    await this.productRepository.updateById(id, product);
  }

  @put('/products/{id}')
  @response(204, {
    description: 'Product PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() product: Product,
  ): Promise<void> {
    await this.productRepository.replaceById(id, product);
  }

  @del('/products/{id}')
  @response(204, {
    description: 'Product DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.productRepository.deleteById(id);
  }

  @patch('/products/{productId}/tags/{tagId}', {
    responses: {
      '204': {
        description: 'Product PATCH success',
      },
    },
  })
  async addTagToProduct(
    @param.path.string('productId') productId: string,
    @param.path.string('tagId') tagId: string,
  ): Promise<void> {
    const product = await this.productRepository.findById(productId);
    if (product.tagIds?.includes(tagId)) {
      throw new HttpErrors.BadRequest(`Product already has the tag with id ${tagId}`);
    }

    if (!product.tagIds) {
      product.tagIds = [];
    }
    product.tagIds.push(tagId);
    await this.productRepository.updateById(productId, product);
  }

  @del('/products/{productId}/tags/{tagId}', {
    responses: {
      '204': {
        description: 'Tag removed from Product',
      },
    },
  })
  async removeTagFromProduct(
    @param.path.string('productId') productId: string,
    @param.path.string('tagId') tagId: string,
  ): Promise<void> {
    const product = await this.productRepository.findById(productId);

    if (!product.tagIds?.includes(tagId)) {
      throw new HttpErrors.NotFound(`Tag with id ${tagId} not found in product ${productId}`);
    }

    product.tagIds = product.tagIds.filter(tag => tag !== tagId);
    await this.productRepository.updateById(productId, product);
  }

}
